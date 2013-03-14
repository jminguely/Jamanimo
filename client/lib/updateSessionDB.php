<?php
$db = mysql_connect('localhost','','') or die("Database error"); 
mysql_select_db('jamanimo', $db); 

$query = "SELECT provider_id FROM users WHERE player_id = '".$_POST['session']['playerId']."'";
$result = mysql_fetch_assoc(mysql_query($query));

$credential = $result['provider_id'];

if(sha1($credential) === $_POST['session']['credential']){
	if($_POST['result'] != ''){
		echo 'empty';
	}
	$query = "UPDATE users SET difficulty='".$_POST['session']['difficulty']."', language='".$_POST['session']['language']."' WHERE player_id = '".$_POST['session']['playerId']."'";
	mysql_query($query);
}

   
?>
