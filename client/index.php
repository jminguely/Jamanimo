<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link href='http://fonts.googleapis.com/css?family=Acme' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Amaranth:400,700' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Inika:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="css/normalize.min.css">
    <link rel="stylesheet" href="css/main.css">
</head>

<?php 
require_once( "lib/main.php" ); 
?>

<body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

            <div id="loader">
                <div class="content">
                    <img src="img/loader.gif" width="100px" height="100px"/>
                    <div id="status" data-lang="voteForUs"><? echo $loading; ?> <span></span></div>
                </div>
            </div>
            
            <div id="ribbon"><a href="" data-lang="voteForUs"><? echo $voteForUs; ?></a></div>

            <div id="frame">
                <div id="topFrame"></div>
                <div id="rightFrame"></div>
                <div id="bottomFrame"></div>
                <div id="leftFrame"></div>

                
                <nav id="lang">
                    <a href="#" id="langEN">EN</a> | <a href="#" id="langFR">FR</a> | <a href="#" id="langDE">DE</a>
                </nav>

                <div id="account">
                    <?php if($logged){ ?>
                    <div id="usersInfos">
                        <img width="40px" height="40px" src="<?php echo $photoURL;?>" />
                        <p><?php echo $displayName; ?><br/>
                        <a href="#" id="logout">Logout</a>
                        </p>
                    </div>
                    <?php } else { ?>
                    <div id="loginAuth">
                        <span data-lang="loginWith"><?php echo $loginWith; ?></span> <a href="#" class="provider" id="Facebook">Facebook</a> | <a href="#" class="provider" id="Google">Google</a> | <a href="#" class="provider" id="Twitter">Twitter</a>
                    </div>
                    <?php } ?>
                </div>

                <div id="main">
                <div id="info" class="box">
                    <a class="close chat"></a>

                    <div class="content">
                        <img class="portrait" src=""/>
                        <h1 data-lang="title_infobox"></h1>
                        <h2 data-lang="subtitle_infobox"></h2>
                        <p data-lang="description_infobox"></p>                    
                        <div class="bottom right">
                            <a class="bouton" data-lang="button_play" id="button_play"></a>
                        </div>
                    </div>

                </div>
                <section id="home">
                    <a id="entree" href="#bar"></a>
                    <div id="bulleGorille" class="bounce">
                        <div class="content possible">
                            <a data-lang="accueilMobile" href="#bar" class="link"><?php echo $accueilMobile;?></a>
                        </div>
                        <div data-lang="accueilNoMobile" class="content paspossible">
                            <?php echo $accueilNoMobile;?>
                        </div>
                    </div>
                </section>

                <section id="bar">
                    <a class="arrow right" href="#terrasse"></a>
                    <a class="arrow left" href="#wc"></a>
                    <div class="character" id="flamand">
                        <img class="dark" src="img/characters/flamand/assis_nuit.png"/>
                        <img class="light" src="img/characters/flamand/assis.png"/>
                    </div>
                    <div class="character" id="panda">
                        <img class="dark" src="img/characters/panda/assis_nuit.png"/>
                        <img class="light" src="img/characters/panda/assis.png"/>
                    </div>
                    <div class="character" id="dodo">
                        <img class="dark" src="img/characters/dodo/assis_nuit.png"/>
                        <img class="light" src="img/characters/dodo/assis.png"/>
                    </div>
                    <div class="character" id="morse">
                        <img class="dark" src="img/characters/morse/assis_nuit.png"/>
                        <img class="light" src="img/characters/morse/assis.png"/>
                    </div>
                    <div class="character" id="paresseux">
                        <img class="dark" src="img/characters/paresseux/assis_nuit.png"/>
                        <img class="light" src="img/characters/paresseux/assis.png"/>
                    </div>
                    <div class="character" id="loris">
                        <img class="dark" src="img/characters/loris/assis_nuit.png"/>
                        <img class="light" src="img/characters/loris/assis.png"/>
                    </div>
                </section>

                <section id="wc">
                    <a class="arrow bottom" href="#bar"></a>
                    <div id="bandNames">
                        <a class="dsm" href="http://www.dirtysoundmagnet.ch" target="_blank"></a>
                        <a class="use" href="http://www.underschool-element.com" target="_blank"></a>
                        <a class="lilmaurice" href="http://soundcloud.com/drparkontre" target="_blank"></a>
                        <a class="todos" href="http://www.todosdestinos.ch/" target="_blank"></a>


                    </div>

                </section>

                <section id="terrasse">
                    <a id="buffle"></a>
                    <a id="facebookBuoy" target="_blank" href="https://www.facebook.com/jamanimo"></a>
                    <a id="twitterBuoy" target="_blank" href="https://twitter.com/jamanimo6"></a>
                    <a class="arrow left" href="#bar"></a>
                </section>
                
                <section id="tableau">
                    <a class="bouton bottom left" href="#bar" data-lang="button_quit"><? echo $button_quit; ?></a>

                    <div class="content">
                        <h1 data-lang="tableau_rooms"><? echo $tableau_rooms; ?></h1>
                        <table id="listRooms">
                            <thead><td width="65%" data-lang="tableau_hosts"><? echo $tableau_hosts; ?></td><td width="35%" data-lang="tableau_dispo"><? echo $tableau_dispo; ?></td></thead>
                        </table>
                        <a id="createRoom" data-lang="tableau_create" href="#"><? echo $tableau_create; ?></a>
                    </div>
                </section>

                <section id="jukebox">
                    <a class="bouton bottom left" id="leaveRoom" data-lang="button_quit" href="#"><? echo $button_quit; ?></a>
                    <div class="right bottom">
                        <a class="bouton" data-lang="button_play" id="playTrack"><? echo $button_play; ?></a>
                        <a class="bouton chat" data-lang="button_chat"><? echo $button_chat; ?> <span class="unread"></span></a>
                    </div>
                    <div id="choseDifficulty">
                            <input type="radio" name="difficulty" id="difficulty-easy" value="easy" checked="checked" /> 
                            <label id="labelEasy" for="difficulty-easy" data-lang="difficulty_easy"><? echo $difficulty_easy; ?></label>
                            <input type="radio" name="difficulty" id="difficulty-medium" value="medium" />     
                            <label id="labelMedium" for="difficulty-medium" data-lang="difficulty_medium"><? echo $difficulty_medium; ?></label>
                            <input type="radio" name="difficulty" id="difficulty-hard" value="hard" />     
                            <label id="labelHard" for="difficulty-hard" data-lang="difficulty_hard"><? echo $difficulty_hard; ?></label>
                    </div>
                        <div id="gameRunningSign" data-lang="jukebox_gameRunning">
                            <? echo $jukebox_gameRunning; ?>
                        </div>
                    <div id="jukeboxContainer">

                        <div id="trackList">
                            <div id="trackContainer">
                                <div class="track current" rel="DSMMikes">
                                    <a><span class="band" style="font-size:24px;margin-top:5px">Dirty Sound Magnet</span><br/><span class="song">Mike's Awakening </span></a>
                                </div>
                                <div class="track current" rel="LilMauricePartyEnding">
                                    <a><span class="band" style="font-size:24px;margin-top:5px">Lil Maurice</span><br/><span class="song">The Party's Ending</span></a>
                                </div>
                                <div class="track" rel="TodosdestinosOppidum">
                                    <a><span class="band">Todos destinos</span><br/><span class="song">L'Oppidum du Peuple</span></a>
                                </div>
                                <div class="track" rel="USEPsalmatic">
                                    <a><span class="band" style="font-size:25px;margin-top:5px">Underschool Element</span><br/><span class="song">Psalmatic</span></a>
                                </div>
                            </div>
                        </div>   
                        <a id="slideLeft"><</a>
                        <a id="slideRight" class="shown">></a> 
                    </div>
                                   
                </section>

                <section id="dancefloor">
                     <div class="top left" >
                        <a id="toggleMute"></a>
                    </div>
                        <a class="bouton bottom left" id="quitDancefloor" data-lang="button_quit"><? echo $button_quit; ?></a>
                        <a class="bouton bottom left" id="endGame" data-lang="button_fin"><? echo $button_fin; ?></a>
                        <a class="bouton bottom right" id="togglePause" data-lang="button_chat"><? echo $button_chat; ?><span class="unread"></span></a>

                    <div id="banner">
                        <h1><span id="artistTrack"></span> - <span id="titleTrack"></span></h1>
                        <a id="startGame">Start</a>
                    </div>
                    <div id="resultBoard">
                        <p class="totalScoreCurrentPlayer">68%</p>
                        <table>
                            <tr><td>Player 1</td><td>68%</td><td>Hard</td></tr>
                            <tr><td>Player 2</td><td>34%</td><td>Easy</td></tr>
                            <tr><td>Player 3</td><td>20%</td><td>Medium</td></tr>
                        </table>        

                    </div>

                    <canvas width="400px" height="400px" id="characterCanvas"></canvas>
                    <canvas width="400px" height="400px" id="cursorCanvas"></canvas>
                    <canvas width="400px" height="400px" id="arrowCanvas"></canvas>
                    <canvas width="80px" height="400px" id="stateCanvas"></canvas>
                </section>

                <div id="room" class="box">
                    <a class="close chat"></a>
                        <div class="content">
                            <h2>Current Game</h2>
                            <div id="chatBox">
                                <p id="conversation"></p>
                            </div>
                            <div id="inputChatBox">
                                <input id="contentMessage" type="text" size="48"/>
                                <a id="sendMessage" class="bouton">Send</a>
                            </div>
                            <div class="bottom right" >
                                <ul id="listPlayers"></ul>
                            </div>
                        </div>
                    </div>
        
                    
     </div>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.3.min.js"><\/script>')</script>

    <script src="js/vendor/modernizr-2.6.2.min.js"></script>

    <script type="text/javascript" src="js/vendor/preloadjs-0.2.0.min.js"></script>
    <script type="text/javascript" src="js/vendor/easeljs-0.5.0.min.js"></script>
    <script type="text/javascript" src="js/vendor/tweenjs-0.4.0.min.js"></script>

    <script type="text/javascript" src="js/vendor/easeljs/events/EventDispatcher.js"></script>

    <script type="text/javascript" src="js/vendor/soundjs/Sound.js"></script>
    <script type="text/javascript" src="js/vendor/soundjs/WebAudioPlugin.js"></script>
    <script type="text/javascript" src="js/vendor/soundjs/HTMLAudioPlugin.js"></script>

    <script type="text/javascript" src="js/vendor/socket.io.js"></script>

    <script type="text/javascript" src="js/vendor/jquery.browser.mobile.js"></script>

    <script src="js/preload.js"></script>
    <script src="js/client.js"></script>
    <script src="js/canvas.js"></script>
    <script src="js/music.js"></script>
    <script src="js/input.js"></script>
    <script src="js/game.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/main.js"></script>

    <script>
    var _gaq=[['_setAccount','UA-38253628-1'],['_trackPageview']];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g,s)}(document,'script'));
    </script>
</body>
</html>

<?php
require_once( "lib/hybridauth/Hybrid/Auth.php" );
require_once( "lib/hybridauth/Hybrid/Endpoint.php" ); 

    // Hybrid_Endpoint::process();
?>

