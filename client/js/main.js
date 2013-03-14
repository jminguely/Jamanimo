var assetsPath = "img/";
var decorPath = "decor/";
var charPath = "characters/";
var incompatibleBrowser = false;

var preloadImgs = [
  assetsPath+'bg_result_board.png',
  assetsPath+'bg_resultTable.png',
  assetsPath+'bg_infoBox.png',
  assetsPath+'bg_frame_bottom.png',
  assetsPath+'bg_frame_top.png',
  assetsPath+'bg_frame_left.png',
  assetsPath+'bg_frame_right.png',

  assetsPath+decorPath+'dancefloor.jpg',
  assetsPath+decorPath+'jukebox.jpg',
  assetsPath+decorPath+'bar.jpg',
  assetsPath+decorPath+'toilettes.jpg',
  assetsPath+decorPath+'terrasse.jpg',
  assetsPath+decorPath+'tableau.jpg',
  assetsPath+decorPath+'arche.jpg',
  assetsPath+decorPath+'entree.gif',
  assetsPath+decorPath+'tableau.jpg',

  assetsPath+charPath+'dodo/dance.png',
  assetsPath+charPath+'flamand/dance.png',
  assetsPath+charPath+'loris/dance.png',
  assetsPath+charPath+'morse/dance.png',
  assetsPath+charPath+'panda/dance.png',
  assetsPath+charPath+'paresseux/dance.png'


    ];

      var $tracklist;
      var scrollWidth;
      var numberElementTrackList;
      var trackContainerWidth;

      var messageUnread = 0;

$(document).ready(initMain);

  
  function initMain(){
      // if(!$.browser.webkit){
      //   $('html').addClass('notCompatible');
      //   incompatibleBrowser = true;
      // }else{
      //   $('html').addClass('compatible');
      //   incompatibleBrowser = false;
      // }


      $('#choseDifficulty #difficulty-'+session['difficulty']).attr('checked', true);

      loadAll(preloadImgs);
      $('nav#lang a').click(changeLanguage);
      toggleNav();
      hash();

      initCanvas()
      initSocket();
      initMusic();

      $tracklist = $('#trackList');
      scrollWidth = $tracklist.outerWidth();
      numberElementTrackList = $('#trackContainer > .track').length;
      trackContainerWidth = numberElementTrackList*scrollWidth;

      $('#trackContainer').width(trackContainerWidth);

      singleWidth = $tracklist.outerWidth();

  }

  function slideJukeboxToDirection(direction){
    var trackname;
    if(direction === 'right'){
        trackname = $('#trackList .track.current').next().attr('rel');
    }else{
        trackname = $('#trackList .track.current').prev().attr('rel');
    }
    if(trackname != undefined){
      slideJukeboxToName(trackname);
      browseJukebox(trackname);
    }
  }

  function slideJukeboxToName(trackName){
    $('#trackList .track.current').removeClass('current');
    var offsetLeft = $('#trackList .track[rel^='+trackName+']').addClass('current').position().left;

    $('#trackList').animate({
        'scrollLeft': offsetLeft
        }, 300, function(){
          if($('#trackList .track.current').prev().length === 0){
            $('#slideLeft').removeClass('shown');
          }else{
            $('#slideLeft').addClass('shown');
          }
          if($('#trackList .track.current').next().length === 0){
            $('#slideRight').removeClass('shown');
          }else{
            $('#slideRight').addClass('shown');
          }    
        });
  }


  
  
 /*******************************************************
 * FONCTION changeLanguage
 * @desc: change de langue au click
 * ****************************************************/

function changeLanguage(){
    session['language'] = $(this).attr('id').substring(4).toLowerCase();

    $.getJSON('js/i18n/arche.'+$(this).attr('id').substring(4).toLowerCase()+'.json', function(data) {

        $('*[data-lang]').each(function(){
          var id=$(this).attr('data-lang');
          var reg=new RegExp("[_]+", "g");
          var part = id.split(reg);
          if(data[part[0]] != undefined){
            if(part[1]){
                $(this).html(data[part[0]][part[1]]);    
            }else{
                $(this).html(data[part[0]]);
            } 
          }
        })

    });

    updateSessionUser();
    
    return false;
}

function gotoPage(page){
    document.location.hash='#'+page;
}

/*******************************************************
 * FONCTION showPage
 * @desc: permet de passer à la page suivante
 * ****************************************************/

function showPage(hash){
    var the_id = hash.substring(1); 

    $('section.current').fadeOut(200).delay(200).removeClass('current');  
    $('section#'+the_id).fadeIn(200).delay(200).addClass('current');  

    $('nav#general li').removeClass('current');
    $('nav#general li.'+the_id).addClass('current');

    toggleNav();

    if(the_id == 'bar'){
      if(incompatibleBrowser) {
        gotoPage('home');
      }
    }


    if(the_id == 'tableau'){
      verifySocket();
      if(session['character'] == undefined){
          gotoPage('bar');
      }
      if(session['roomId'] > 0){
        leaveRoom();
      }
    }

    if(the_id == 'jukebox'){
      if(session['playerSocketId'] == undefined){
          gotoPage('tableau');
      }
      if(session['roomInfos']['playerHostId'] != session['playerSocketId']){
        $('#jukebox').addClass('guest');
      }else{
        $('#jukebox').removeClass('guest');
      }
    }

    if(the_id == 'dancefloor'){
      if(session['roomInfos']['playerHostId'] != session['playerSocketId']){
        $('#dancefloor').addClass('guest');
      }else{
        $('#dancefloor').removeClass('guest');
      }
      if(session['character'] == undefined){
          gotoPage('bar');
      }else{
        initGame();
        showBanner();
      }
    }


    hideInfoBox(false);

    return false;
  }

/*******************************************************
 * FONCTION toggleNav
 * @desc: fait apparaître la navigation quand on se trouve dans les différentes zones du bar
 * ****************************************************/

function toggleNav(){
    if($('#home').hasClass("current") || $('#dancefloor').hasClass("current") || $('#tableau').hasClass("current") || $('#jukebox').hasClass("current")){
        $('nav#general').hide();
    }else{
        $('nav#general').show();
    }
}


/*******************************************************
 * FONCTION hash
 * @desc: permet de hasher le site
 * ****************************************************/

function hash(){
  // Bind an event to window.onhashchange that, when the hash changes, gets the
  // hash and adds the class "selected" to any matching nav link.
  $(window).hashchange( function(){

    var hash = (location.hash)?location.hash:'#home';
        
    // Set the page title based on the hash.
    document.title = 'Jamanimo | ' + ( hash.replace( /^#/, '' ) || 'blank' ) + ' ♫';
    
    showPage(hash)
  })
  
  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).hashchange();
}

function toggleRoomBox(){
  $('#room.box').toggleClass('visible');
}
function showRoomBox(){
  $('#room.box').addClass('visible');
}
function hideRoomBox(){
  $('#room.box').removeClass('visible');
}

function toggleInfoBox(type, page){
  if(!$('#info.box').hasClass('visible')){
    getInfos(type, page);
  }else{
    if($('#info.box.visible').hasClass(page)){
      $('#info.box.visible').removeClass(page);
      hideInfoBox();
    }else{
      hideInfoBox(function(){
        getInfos(type, page);
      });
    }
    
  }
}

function getInfos(type, page){
    $.getJSON('js/i18n/arche.'+session['language']+'.json', function(data) {
        $('#info.box [data-lang="title_infobox"]').text(data[type][page]['title_infobox']);
        $('#info.box [data-lang="subtitle_infobox"]').text(data[type][page]['subtitle_infobox']);
        $('#info.box [data-lang="description_infobox"]').text(data[type][page]['description_infobox']);
        $('#info.box #lang_button_play').show();
        $('#info.box [data-lang="button_play"]').text(data['button']['play']).attr('rel', page);
        $('#info.box .portrait').attr('src', 'img/characters/'+page+'/portrait.png');
        showInfoBox(page);

    });
    
    return false;
}

function receiveMessage(username, message){
    $('#conversation').append('<b>'+username + ':</b> ' + message + '<br>');
    if(!$('#room.box').hasClass('visible')){
      messageUnread++;
      $('.unread').fadeIn().text(messageUnread);
    }

}

function updateSessionUser(){
    $.post("lib/updateSessionDB.php", { session: session });
}


function showInfoBox(page){
  $('#info.box').addClass('visible '+page).attr('rel',page);
}

function hideInfoBox(callback){
  $('#info.box').attr('class','box').attr('rel','').delay(500).queue(function(next) {
    if(callback)callback();
    next();
  }); 
}

function showStartButton(){
  $('#banner #startGame').addClass('visible');
}

function hideStartButton(){
  $('#banner #startGame').removeClass('visible');
}

function showBanner(){
  $('#banner #titleTrack').text(trackInfos['title']);
  $('#banner #artistTrack').text(trackInfos['artist']);
  $('#banner').attr('class', 'visible');
  $('#dancefloor canvas').fadeOut();
  $('#resultBoard').removeClass('visible');
  $('#dancefloor #gotoJukebox').fadeIn();
  $('#dancefloor #endGame').hide();
}

function showGameField(){
  $('#dancefloor canvas').fadeIn();
  $('#banner').removeClass('visible');
  $('#resultBoard').removeClass('visible');
  $('#dancefloor #gotoJukebox').hide();
  $('#dancefloor #endGame').fadeIn();
}

function showResultBoard(){
  hideStartButton();
  $('#resultBoard').addClass('visible');
  $('#banner').attr('class', 'ended');
  $('#dancefloor canvas').fadeOut();
  $('#dancefloor #gotoJukebox').fadeIn();
  $('#dancefloor #endGame').hide();
}

function hideResultBoard(){
  $('#resultBoard').fadeOut();
}


function checkRoomState(){
      if(session['roomInfos']['state'] === 'running'){
        showWaitingSign();
      }else{
        hideWaitingSign();
      } 
}

function showWaitingSign(){
  $('#jukebox').addClass('running');
}
function hideWaitingSign(){
  $('#jukebox').removeClass('running');
}
