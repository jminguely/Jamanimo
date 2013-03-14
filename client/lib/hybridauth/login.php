<?php

error_reporting(E_ALL);

/*!
* HybridAuth
* http://hybridauth.sourceforge.net | http://github.com/hybridauth/hybridauth
* (c) 2009-2012, HybridAuth authors | http://hybridauth.sourceforge.net/licenses.html 
*/

// ------------------------------------------------------------------------
//  HybridAuth End Point
// ------------------------------------------------------------------------

require_once( "Hybrid/Auth.php" );

$db = mysql_connect('localhost','jamanimo','jam123') or die("Database error"); 
mysql_select_db('jamanimo', $db); 

    $config = array( 
      "base_url" => "http://jamanimo.com/lib/hybridauth/",  
      "providers" => array (
        "Facebook" => array ( 
          "enabled" => true,
          "keys"    => array ( "id" => "588154904531698", "secret" => "9987e48bee1f8d1614dcb3f047897b08" ), 
          "display" => "popup" // optional

        ),
        "Google" => array ( 
          "enabled" => true,
          "keys"    => array ( "id" => "396459320278.apps.googleusercontent.com", "secret" => "x32S_4WyhfTXtB_ER1TKXdRj" ), 
        ),
        "Twitter" => array ( // 'key' is your twitter application consumer key
            "enabled" => true,
             "keys" => array ( "key" => "TclHlY43V3SY03sDT6zQ", "secret" => "T7BrCcqrejiYrLNcS6xL5DxIfbVkDuA9xhEyxxIY" )
        )

    ));

        $error = false;
        $user_profile = false;
        $user_exist = false;

        try{
            $hybridauth = new Hybrid_Auth( $config );

            $adapter = $hybridauth->authenticate( $_GET['provider']);

            $user_profile = $adapter->getUserProfile();

            $user_exist = get_user_by_provider_id($user_profile->identifier);

            if($user_exist){
              update_hybridauth_user(
                $user_profile->identifier, 
                $user_profile->email, 
                $user_profile->displayName,
                $user_profile->photoURL
              ); 

            }else{
              create_new_hybridauth_user(
                $_GET['provider'],
                $user_profile->identifier, 
                $user_profile->email, 
                $user_profile->displayName,
                $user_profile->photoURL
              ); 
              $user_exist = get_user_by_provider_id($user_profile->identifier);
            }

              $_SESSION['usersData'] = array(
                'logged' => true, 
                'playerId' => $user_exist['player_id'], 
                'email' => $user_exist['email'], 
                'displayName' => $user_exist['displayName'],
                'photoURL' => $user_exist['photoURL'],
                'language' => $user_exist['language'],
                'difficulty' => $user_exist['difficulty'],
                'credential' => sha1($user_profile->identifier)
              );


            echo "<SCRIPT LANGUAGE='javascript'>;
                  if(window.opener && !window.opener.closed) {
                      window.opener.location.reload();
                  }
                  window.close();
                  </SCRIPT>";
            
        }
      catch( Exception $e ){  
      // Display the recived error, 
      // to know more please refer to Exceptions handling section on the userguide
      switch( $e->getCode() ){ 
        case 0 : echo "Unspecified error."; break;
        case 1 : echo "Hybriauth configuration error."; break;
        case 2 : echo "Provider not properly configured."; break;
        case 3 : echo "Unknown or disabled provider."; break;
        case 4 : echo "Missing provider application credentials."; break;
        case 5 : echo "Authentification failed. " 
                    . "The user has canceled the authentication or the provider refused the connection."; 
                 break;
        case 6 : echo "User profile request failed. Most likely the user is not connected "
                    . "to the provider and he should authenticate again."; 
                 $adapter->logout(); 
                 break;
        case 7 : echo "User not connected to the provider."; 
                 $adapter->logout(); 
                 break;
        case 8 : echo "Provider does not support this feature."; break;
      } 
   
      // well, basically your should not display this to the end user, just give him a hint and move on..
      echo "<br /><br /><b>Original error message:</b> " . $e->getMessage();  
    }

    function get_user_by_provider_id($provider_id){
      $query = "SELECT * FROM users WHERE provider_id = '".$provider_id."'";
      return mysql_fetch_assoc(mysql_query($query));

    }

    function create_new_hybridauth_user($provider_name, $provider_id, $email, $displayName, $photoURL){
      $query = "INSERT INTO users (provider_id, provider_name, email, displayName, photoURL, last_connection, created_at) VALUES ('".$provider_id."', '".$provider_name."', '".$email."','".$displayName."','".$photoURL."', NOW(), NOW()) ";
      mysql_query($query);
    }

    function update_hybridauth_user($provider_id, $email, $displayName, $photoURL){
      $query = "UPDATE users SET email='".$email."', displayName='".$displayName."', photoURL='".$photoURL."', last_connection=NOW() WHERE provider_id = '".$provider_id."'";
      mysql_query($query);
    }       

?>
