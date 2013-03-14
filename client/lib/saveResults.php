<?php
$db = mysql_connect('localhost','','') or die("Database error"); 
mysql_select_db('jamanimo', $db); 

$queryGetSondId = "SELECT song_id FROM songs WHERE trackname = '".$_POST['trackName']."'";
$song_id = mysql_fetch_assoc(mysql_query($queryGetSondId))['song_id'];

if(isset($_POST['session']['playerId']) && $_POST['session']['playerId'] > 0){
	$query = "SELECT provider_id FROM users WHERE player_id = '".$_POST['session']['playerId']."'";
	$result = mysql_fetch_assoc(mysql_query($query));

	$credential = $result['provider_id'];

	if(sha1($credential) === $_POST['session']['credential']){
		$queryInsertScore = "INSERT INTO scores (song_id, player_id, timestamp, totalSuccess, totalFail, bestCombo, difficulty) VALUES (".$song_id.", ".$_POST['session']['playerId'].", NOW(), ".$_POST['currentPlayerResult']['totalSuccess'].", ".$_POST['currentPlayerResult']['totalFail'].", ".$_POST['currentPlayerResult']['bestCombo'].", ".$_POST['currentPlayerResult']['difficulty'].")";
		mysql_query($queryInsertScore);
	}
}else{
	$queryInsertScore = "INSERT INTO scores (song_id, player_id, timestamp, totalSuccess, totalFail, bestCombo, difficulty) VALUES (".$song_id.", 0, NOW(), ".$_POST['currentPlayerResult']['totalSuccess'].", ".$_POST['currentPlayerResult']['totalFail'].", ".$_POST['currentPlayerResult']['bestCombo'].", ".$_POST['currentPlayerResult']['difficutly'].")";
	mysql_query($queryInsertScore);
}

   
?>
