
var trackInfos;
var partition;
var socket;

var statusGame = 'pending';

var local = false;

function verifySocket(){
	if(socket != undefined && socket['socket']['connected']){
		$("#tableau").addClass('connected');
		updateListRoom();
	}else{
		setTimeout(function(){verifySocket()},3000);
	}
}

function initSocket(){
	socket = io.connect('http://localhost:8080');

	socket.on('playerReady', function(playerInfos) {
		session['playerSocketId'] = playerInfos['playerSocketId'];
		socket.emit('responseUserInfos', {
			session: session
		});
	});

	socket.on('guestDisplayName', function(data) {
		session['displayName'] = data.displayName;
	});
	

	socket.on('roomReady', function(roomInfos) {
		checkRoomState(session['roomInfos']['state']);
		session['roomInfos'] = roomInfos;
		gotoPage('jukebox');
		updateListRoom();
	});

	socket.on('roomJoined', function(roomInfos) {
		if(roomInfos['roomId'] != 0){
			session['roomInfos'] = roomInfos;		
			checkRoomState();
			gotoPage('jukebox');
			updateListRoom();
		}else{
			console.log('Room full !');
		}
	});

	socket.on('roomLeft', function() {
		if(session['roomInfos']['roomId'] != 0){
			session['roomInfos'] = {};
			hideRoomBox();

			stopGameControl();
			stopCanvas();
			stopMusic();

			gotoPage('tableau');
		}
	});


	socket.on('listRoomsUpdated', function(listRooms) {
		$('#listRooms tbody').remove();
	    for(var roomId in listRooms) {
	    	$('#listRooms').append('<tr rel="'+listRooms[roomId]['roomId']+'"><td>'+listRooms[roomId]['playerHostdisplayName']+'</td><td>'+Object.keys(listRooms[roomId]['playerList']).length+'/'+listRooms[roomId]['placeAvailable']+'</td></tr>');
		}
		if(session['roomId'] > 0){
			$('#listPlayers').empty();
	    	for(var playerId in listRooms[session['roomId']]['playerList']) {
	    		var player = listRooms[session['roomId']]['playerList'][playerId];
	    		$('#listPlayers').append('<li rel="'+player['playerSocketId']+'">'+player['displayName']+'</li>');
	    	}
		}
	});

	socket.on('gameReady', function(data) {
		session['gameId'] = data['gameInfos']['gameId'];
		if(data['trackInfos']['trackName'] != undefined){
			prepareMusic(data['trackInfos']['trackName']);
			trackInfos = data['trackInfos'];
			partition = trackInfos['partitions'][session['difficulty']];
			trackInfos['maximum_points'] = Object.keys(partition).length;
		}
		startGameControl();
		startCanvas();
		gotoPage('dancefloor');

	});

	socket.on('allPlayersReady', function() {
		showStartButton();
	});


	

	socket.on('gameUpdated', function(data) { 
		updateScores(data);
	});

	socket.on('jukeboxBrowsed', function(trackName) {
		slideJukeboxToName(trackName);
	});


	socket.on('launchGame', function() {
		showGameField();
		startMusic();
		statusGame = 'playing';
	});

	socket.on('gameEnded', function(data) {
		console.log(data);
		stopMusic();
		stopCanvas();

		calculateResultBoard(data['playerList'], data['trackName']);
	});

	socket.on('emitMessage', function(data) {
		var username = data['session']['displayName'];
		var message = data['message'];
		receiveMessage(username, message);
	});

	socket.on('gotoPage', function(page) {
		if(page === 'tableau'){
			leaveRoom();
		}else{
			if(page === 'jukebox'){
				checkRoomState();
			}
			gotoPage(page);
		}
		
	});


}

function updateSocketUser(){
	socket.emit('updateSocketUser', {
		session: session
	});
}


function joinRoom(roomId) {
	if(session['roomInfos']['roomId'] > 0){
		leaveRoom();
	}
	roomId = roomId || 0;
	socket.emit('joinRoom', {
		session: session,
		roomId: roomId 
	});
}

function leaveRoom() {
	socket.emit('leaveRoom', {
		session: session
	});
}

function browseJukebox(trackName) {
	socket.emit('browseJukebox', {
		session: session,
		trackName: trackName
	});
}

function sendMessage(message) {
	socket.emit('sendMessage', {
		session: session,
		message: message
	});
}

function createRoom() {
	socket.emit('createRoom', {
		session: session
	});
};

function updateListRoom(){
	socket.emit('updateListRoom');
}

function createGame(trackName) {
	socket.emit('createGame', {
		trackName: trackName,
		session: session
	});
};

function trackPreloaded(){
	socket.emit('preloadReady', {
		session: session
	});
}

function playGame() {
	socket.emit('startGame', {
		session: session
	});
}

function endGame() {
	socket.emit('endGame', {
		session: session
	});
}
function quitDancefloor() {
	stopGameControl();
	stopCanvas();
	stopMusic();
	socket.emit('quitDancefloor', {
		session: session
	});
}


function resumeGame() {
	socket.emit('resumeGame', {
		session: session
	});
}

function sendNotePlayed(success, difference, index) {
	socket.emit('sendNotePlayed', {
		session: session,
		success: success,
		difference: difference,
		index: index
	});
}


