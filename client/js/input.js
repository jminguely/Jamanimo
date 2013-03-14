document.onkeydown = handleKeyDown;
var controlPressed = '';
var KEYCODE_SPACE = 32; //usefull keycode
var KEYCODE_UP = 38; //usefull keycode
var KEYCODE_DOWN = 40; //usefull keycode
var KEYCODE_LEFT = 37; //usefull keycode
var KEYCODE_RIGHT = 39; //usefull keycode
var KEYCODE_W = 87; //usefull keycode
var KEYCODE_A = 65; //usefull keycode
var KEYCODE_D = 68; //usefull keycode

$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}

function handleKeyDown(e) {

    //cross browser issues exist
    if(!e) {
        var e = window.event;
    }
    switch(e.keyCode) {
    case KEYCODE_LEFT:
        controlPressed = 'left';
        return false;
        break;
    case KEYCODE_RIGHT:
        controlPressed = 'right';
        return false;
        break;
    case KEYCODE_UP:
        controlPressed = 'up';
        return false;
        break;
    case KEYCODE_DOWN:
        controlPressed = 'down';
        return false;
        break;
    }
    // return false;
}


$('#createRoom').click(function() {
    createRoom();
    return false;
});
$('#joinRoom').click(function() {
    joinRoom();
    return false;
});
$('#leaveRoom').click(function() {
    leaveRoom();
    return false;
});

$('#updateList').click(function() {
    updateListRoom();
    return false;
});
$('#togglePause').click(function() {
    messageUnread = 0;
    $('.unread').hide();

    toggleRoomBox();
    
    if(session['roomInfos']['state'] === 'running'){
        togglePauseCanvas();
    }    

    if($(this).hasClass('paused')){
        setVolumeMusic(1);
    }else{
        setVolumeMusic(0.2);
    }

    $(this).toggleClass('paused');
    
    return false;
});
$('#toggleMute').click(function() {
    $(this).toggleClass('muted')
    toggleMute();
    return false;
});

$('#playTrack').click(function() {
    if(session['roomInfos']['playerHostId'] === session['playerSocketId']){
        var trackName = $('.track.current').attr('rel');
        createGame(trackName);
    }
    return false;
});

$('#startGame').click(function() {
    hideStartButton();
    playGame();
    return false;
});

$('#endGame').click(function() {
    endGame();
    return false;
});

$('#quitDancefloor').click(function() {
    quitDancefloor();
    return false;
});






$('#trackContainer .track').click(function() {
    if(session['roomInfos']['playerHostId'] === session['playerSocketId']){
        var trackName = $(this).attr('rel');
        createGame(trackName);
    }
    return false;
});

$('input:radio[name="difficulty"]').change(function(){
    session['difficulty'] = $(this).val();
    updateSocketUser();
    updateSessionUser();
});


$('#listRooms tr').live('click', function() {
    joinRoom($(this).attr('rel'));
    return false;
});


$('#logout').click(function(){
    $.post('lib/hybridauth/logout.php', function(data) {
      if(data === 'success') window.location.reload();
    });
    return false;

});


$('#loginAuth a.provider').click(function(){
    var provider = $(this).attr('id');
    newwindow=window.open('lib/hybridauth/login.php?provider='+provider,provider,'height=330,width=600');
    if (window.focus) {newwindow.focus()}
      return false;
});


$('.character').click(function(){
    var character = $(this).attr('id');
    toggleInfoBox('character', character);
});

$('#button_play').click(function(){
    hideInfoBox();
    session['character'] = $(this).attr('rel');
    gotoPage('tableau');

    return false;
});

$('.bouton.chat').click(function(){
    messageUnread = 0;
    $('.unread').hide();

    toggleRoomBox();
    return false;
});

$('.box .close').click(function(){
    if($('section#dancefloor').hasClass('current')) {
        $('#togglePause').click();
    }else{
        $(this).parent('.box').attr('class', 'box');
    }
    return false;
});

$("#contentMessage").enterKey(function () {
    $('#sendMessage').click();
})

$('#sendMessage').click(function(){
    var content = $('#contentMessage').val();
    if(content != ''){
        sendMessage(content);
        $('#contentMessage').val('');
    }
    return false;
});

      $('#slideRight').click(function(){
        slideJukeboxToDirection('right');
      });

      $('#slideLeft').click(function(){
        slideJukeboxToDirection('left');

      });




//Action lorsque l'utilisateur change de fenêtre
$(window).blur(function(e) {
    if(statusGame == 'playing'){
        // $('#togglePause').click();
    }
});


