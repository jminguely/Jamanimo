<?php 

$page = $_GET['page'];
$type = $_GET['type'];

$ch = curl_init('http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'].'js/i18n/arche.'.$allowedLang.'.json');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,  'bla');
curl_setopt($ch, CURLOPT_POST, 1);

$jsonLang = curl_exec($ch);
$jsonLang = json_decode($jsonLang);

echo $jsonLang;

// echo $homepage;