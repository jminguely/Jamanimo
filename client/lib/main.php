<?php

//internationalization

//selection langue
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);

switch ($lang){
    //si c'est FR
    case "fr":
        $allowedLang='fr';
        break;
    //si c'est DE
    case "de":
        $allowedLang='de';
        break;
    //si c'est EN
    default:
        $allowedLang='en';
        break;
}

$ch = curl_init('http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'].'js/i18n/arche.'.$allowedLang.'.json');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,  'bla');
curl_setopt($ch, CURLOPT_POST, 1);

$jsonLang = curl_exec($ch);
$jsonLang = json_decode($jsonLang);

$accueilMobile=$jsonLang->accueilMobile;
$accueilNoMobile=$jsonLang->accueilNoMobile;
$loginWith=$jsonLang->loginWith;
$voteForUs=$jsonLang->voteForUs;
$loading=$jsonLang->loading;


$button_play=$jsonLang->button->play;
$button_quit=$jsonLang->button->quit;
$button_chat=$jsonLang->button->chat;
$button_fin=$jsonLang->button->fin;

$difficulty_easy=$jsonLang->difficulty->easy;
$difficulty_medium=$jsonLang->difficulty->medium;
$difficulty_hard=$jsonLang->difficulty->hard;


$tableau_rooms=$jsonLang->tableau->rooms;
$tableau_hosts=$jsonLang->tableau->hosts;
$tableau_dispo=$jsonLang->tableau->dispo;
$tableau_create=$jsonLang->tableau->create;

$dancefloor_jukebox=$jsonLang->dancefloor->jukebox;

$jukebox_gameRunning=$jsonLang->jukebox->gameRunning;


session_start();
    
$logged = false;

echo    "<script>var session = {
            roomInfos:{}
        };";

if(isset($_SESSION['usersData']['logged']) && $_SESSION['usersData']['logged']){
    $logged = true;
    $email = $_SESSION['usersData']['email'];
    $displayName = $_SESSION['usersData']['displayName'];
    $photoURL = $_SESSION['usersData']['photoURL'];
    $playerId = $_SESSION['usersData']['playerId'];
    $difficulty = $_SESSION['usersData']['difficulty'];
    $language = $_SESSION['usersData']['language'];
    $credential = $_SESSION['usersData']['credential'];

    echo "session['playerId'] = '".$playerId."';\n";
    echo "session['displayName'] = '".$displayName."';\n";
    echo "session['difficulty'] = '".$difficulty."';\n";
    echo "session['language'] = '".$language."';\n";
    echo "session['credential'] = '".$credential."';\n";
}else{
    echo "session['language'] = '".$allowedLang."';\n";
    echo "session['difficulty'] = 'easy';\n";
}

echo "</script>";

?>