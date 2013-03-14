var io = require('socket.io').listen(8080);

var cjson = require('cjson');

var playerIndex = 0;
var roomIndex = 0;
var gameIndex = 0;

var listRooms = {};
var listPlayers = {};
var listGames = {};

io.sockets.on('connection', function(socket) {
  var playerSocketId = createNewPlayer(socket);

  socket.emit('playerReady', {
    playerSocketId: playerSocketId
  });

  socket.on('responseUserInfos', function (data) {
          listPlayers[playerSocketId]['difficulty'] = data['session']['difficulty'];
        if(data['session']['playerId'] != undefined){
          listPlayers[playerSocketId]['playerId'] = data['session']['playerId'];
          listPlayers[playerSocketId]['displayName'] = data['session']['displayName'];
        }else{
          playerIndex++;
          listPlayers[playerSocketId]['displayName'] = 'Guest'+playerIndex;
          socket.emit('guestDisplayName', {
            displayName: listPlayers[playerSocketId]['displayName']
          });
        }
  });

  socket.on('updateSocketUser', function (data) {
    listPlayers[playerSocketId]['difficulty'] = data['session']['difficulty'];
    console.log(listPlayers);
  });

  

  socket.on('disconnect', function () {
        killPlayer(socket.id);
  });

  

  socket.on('createRoom', function(data) {
    for(var roomId in listRooms){
      if(listRooms[roomId]['playerHostId'] === data['session']['playerSocketId']){
        return false;
        break;
      }
    }
    var currentRoomId = createNewRoom(data['session']['playerSocketId']);
    socket.emit('roomReady', listRooms[currentRoomId]);
  });


  socket.on('joinRoom', function(data) {
    var roomId = data['roomId'];
    var playerSocketId = data['session']['playerSocketId'];
    if(roomId > 0){
      roomInfos = joinRoomId(playerSocketId, roomId);
      socket.emit('roomJoined', roomInfos);    
    }
  });

  socket.on('leaveRoom', function(data) {
    var playerSocketId = data['session']['playerSocketId'];
    var roomId = data['session']['roomInfos']['roomId'];

    if(roomId > 0 && listRooms[roomId] != undefined){
      if(listRooms[roomId]['playerHostId'] ===  playerSocketId){
        killRoom(roomId);
      }else{
        leaveRoom(roomId, playerSocketId)
      }
      socket.emit('roomLeft');    
      emitToAllPlayer('listRoomsUpdated', listRooms);
    }
  });

  socket.on('updateListRoom', function() {
    socket.emit('listRoomsUpdated', listRooms);    
  });

  socket.on('browseJukebox', function(data) {
    if(data['session']['roomInfos']['playerHostId'] === data['session']['playerSocketId']){
      emitToPlayerFromRoomId(data['session']['roomInfos']['roomId'], 'jukeboxBrowsed', data['trackName']);
    }
  });


  socket.on('createGame', function(data) {
    var roomId = data['session']['roomInfos']['roomId'];
    if(roomId > 0){
      var gameId = createNewGame(data['trackName'], roomId);
      var partition = preparePartitions(data['trackName'])
      var data = {trackInfos:partition, gameInfos:listGames[gameId]};
      for(var playerId in listGames[gameId]['playerList']){
        listGames[gameId]['playerList'][playerId]['state'] = 'loading';
      }
      emitToPlayerFromRoomId(roomId, 'gameReady', data);
    }

  }); 


  socket.on('preloadReady', function(data) {
    var currentGameId = data['session']['gameId'];
    var currentPlayerId = data['session']['playerSocketId'];
    if(currentGameId > 0){

      listGames[currentGameId]['playerList'][currentPlayerId]['state'] = 'preloaded';
      var isOneStillWaiting = false;
      for(var playerId in listGames[currentGameId]['playerList']){
        if(listGames[currentGameId]['playerList'][playerId]['state'] != 'preloaded'){
          isOneStillWaiting = true; 
        }
      }
      if(!isOneStillWaiting) emitToPlayerFromGameId(currentGameId, 'allPlayersReady', '');
    }
  });

  socket.on('startGame', function(data) {
    var currentGameId = data['session']['gameId'];
    var currentRoomId = data['session']['roomInfos']['roomId'];

    if(currentGameId > 0 && listGames[currentGameId]['state'] == 'pending'){
      listGames[currentGameId]['state'] = 'running';
      console.log();
      listRooms[currentRoomId]['state'] = 'running';
      
      emitToPlayerFromRoomId(data['session']['roomInfos']['roomId'], 'launchGame', listRooms[currentRoomId]);
    }
  });

  socket.on('endGame', function(data) {
    var currentGameId = data['session']['gameId'];
    var currentRoomId = data['session']['roomInfos']['roomId'];
    if(listGames[currentGameId] != undefined && listGames[currentGameId]['state'] == 'running'){
      if(data['session']['roomInfos']['playerHostId'] === data['session']['playerSocketId']){
        emitToPlayerFromRoomId(currentRoomId, 'gameEnded', listGames[currentGameId]);
        listGames[currentGameId]['state'] = 'ended';
        listRooms[currentRoomId]['state'] = 'pending';
      }else{
        socket.emit('gameEnded', listGames[currentGameId]);
      }
      
    }
  });

  socket.on('quitDancefloor', function(data) {
    var currentGameId = data['session']['gameId'];
    var currentRoomId = data['session']['roomInfos']['roomId'];
    if(currentGameId > 0){
      if(data['session']['roomInfos']['playerHostId'] === data['session']['playerSocketId']){
        emitToPlayerFromRoomId(currentRoomId, 'gotoPage', 'jukebox');
      }else{
        socket.emit('gotoPage', 'tableau');
      }
      
    }
  });


  socket.on('sendNotePlayed', function(data) {
    var currentplayerSocketId = data['session']['playerSocketId'];
    var currentGameId = data['session']['gameId'];
    if(listGames[currentGameId] != undefined){
      var currentRoomId = listGames[currentGameId]['roomId'];
      updateScores(currentplayerSocketId, currentGameId, data['index'], data['success'], data['difference']);
    }
  });

  socket.on('sendMessage', function(data) {
    var currentRoomId = data['session']['roomInfos']['roomId'];

    if(currentRoomId > 0){
      emitToPlayerFromRoomId(currentRoomId, 'emitMessage', data);
  }
  });



});

function updateScores(currentplayerSocketId, currentGameId, index, success, difference){
  infos = listGames[currentGameId]['playerList'][currentplayerSocketId];
  if(success){
    infos['currentCombo']++;
    infos['totalSuccess']++;
    infos['totalPoints'] = infos['totalPoints'] + 10-Math.round(difference*100);
  }else{
    infos['totalFail']++;
    if(infos['currentCombo'] > infos['bestCombo']){
      infos['bestCombo'] = infos['currentCombo']
    }
    infos['currentCombo'] = 0;
  }
  listGames[gameIndex]['playerList'][currentplayerSocketId] = infos;

  emitToPlayerFromGameId(gameIndex, 'gameUpdated', listGames[gameIndex]);
}

function createNewPlayer(socket){
  listPlayers[socket.id] = {};
  listPlayers[socket.id]['socket'] = socket;
  return socket.id;
}

function createNewRoom(playerSocketId){
    roomIndex++;

    var room = {
      roomId: roomIndex,
      state: 'pending',
      playerHostId: playerSocketId,
      playerHostdisplayName: listPlayers[playerSocketId]['displayName'],
      playerList: {},
      placeAvailable: 6
    }

    var playerList = {
      playerSocketId: playerSocketId,
      displayName: listPlayers[playerSocketId]['displayName']
    }
    room['playerList'][playerSocketId] = playerList;

    listRooms[roomIndex] = room;

    emitToAllPlayer('listRoomsUpdated', listRooms);

    return roomIndex;
}

function killRoom(roomId){
  if(roomId in listRooms){
    emitToPlayerFromRoomId(roomId, 'roomLeft');
    emitToAllPlayer('listRoomsUpdated', listRooms);
    delete listRooms[roomId]
  }
}

function leaveRoom(roomId, playerSocketId){
  delete listRooms[roomId]['playerList'][playerSocketId];
  emitToAllPlayer('listRoomsUpdated', listRooms);
}

function killPlayer(playerSocketId){
  if(playerSocketId in listPlayers){

    for(roomId in listRooms){
      if(listRooms[roomId]['playerHostId'] === playerSocketId){
        killRoom(roomId);
        break;
      }
      if(playerSocketId in listRooms[roomId]['playerList']){
        leaveRoom(roomId, playerSocketId);
      }
    }
    delete listPlayers[playerSocketId]
  }
}

function joinRoomId(playerSocketId, roomId){
  if(listRooms[roomId] != undefined && Object.keys(listRooms[roomId]['playerList']).length < listRooms[roomId]['placeAvailable']) {
        var playerList = {
          playerSocketId: playerSocketId,
          displayName: listPlayers[playerSocketId]['displayName']
        }

        listRooms[roomId]['playerList'][playerSocketId] = playerList;

        emitToAllPlayer('listRoomsUpdated', listRooms);

        return listRooms[roomId];
    }
  return 0;
}

function createNewGame(trackName, roomId){
    gameIndex++;  

    var game = {
      gameId: gameIndex,
      roomId: roomId,
      playerInfos: {},
      state: 'pending',
      trackName: trackName,
      playerList: {}
    }

    for(var playerSocketId in listRooms[roomId]['playerList']) {
      playerInfos = {
          playerSocketId: playerSocketId,
          displayName: listPlayers[playerSocketId]['displayName'],
          state: 'waiting',
          totalSuccess: 0,
          totalFail: 0,
          currentCombo: 0,
          totalPoints: 0,
          bestCombo: 0,
          score: 0,
          difficulty: listPlayers[playerSocketId]['difficulty']

      }
      game['playerList'][playerSocketId] = playerInfos;
    }

    listGames[gameIndex] = game;

    return gameIndex;
}

function randomDirection(difficulty){
  var qty = 2;
  switch(difficulty){
    case 'medium':
      qty = 3;
    break;
    case 'hard':
      qty = 4;
    break;
  }
  switch(Math.floor(Math.random()*qty+1)){
    case 1:
      return 'left';
    break;
    case 2:
      return 'right';
    break;
    case 3:
      return 'up';
    break;
    case 4:
      return 'down';
    break;

  }
}

  function preparePartitions(trackName) {
    var ret = {};
    ret['partitions'] = {};
    var trackInfos = cjson.load('json/' + trackName + '.json');
    var trackInfosMarks = trackInfos['auftakt_result']['click_marks'];

    for(var i in trackInfosMarks) {

        ret['partitions'][i] = {};

        for(var j = 0;
        j < trackInfosMarks[i].length;
        j++){
          ret['partitions'][i][j] = {};
          ret['partitions'][i][j]['time'] = Math.round(trackInfosMarks[i][j] * 1000) / 1000;
          //Si la note d'avant est distante de moins d'un certain temps, joue la meme direction
          if(trackInfosMarks[i][j]-trackInfosMarks[i][j-1] < 0.3){
            ret['partitions'][i][j]['direction'] = ret['partitions'][i][j-1]['direction'];
          }else{
            ret['partitions'][i][j]['direction'] = randomDirection(i);
          }
      }
    }
    ret['artist'] = trackInfos['artist'];
    ret['title'] = trackInfos['title'];

    ret['clicksPerBar'] = trackInfos['auftakt_result']['clicks_per_bar'];
    ret['overall_tempo'] = trackInfos['auftakt_result']['overall_tempo'];
    ret['trackName'] = trackName;
    return ret;
  }

function emitToAllPlayer(functionName, data){
  data = data || {};
  for(var playerSocketId in listPlayers) {
      listPlayers[playerSocketId]['socket'].emit(functionName, data);
    }
}

function emitToPlayerFromGameId(gameId, functionName, data){
    data = data || {};

    for(var playerSocketId in listGames[gameId]['playerList']) {
      if(listPlayers[playerSocketId] != undefined){
        listPlayers[playerSocketId]['socket'].emit(functionName, data);
      }
    }
}

function emitToPlayerFromRoomId(roomId, functionName, data){
    data = data || {};
    for(var playerSocketId in listRooms[roomId]['playerList']) {
      listPlayers[playerSocketId]['socket'].emit(functionName, data);
    }
}