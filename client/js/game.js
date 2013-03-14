    var margeErreur = 0.1;
    var controlThread;

    function startGameControl(){
        controlThread = setInterval(controlTicker, 10);
    }

    function stopGameControl(){
        clearInterval(controlThread);
    }

    function successNote(difference, index) {
        difference = Math.round(difference*100);
        pressCursorSuccess();
        if(difference<2){
            showText('perfect');
        }
        partition[index].status = 'success';
        updateArrow(index, 'success');
        sendNotePlayed(true, difference, index);
    }

    function failNote(index) {
        index = index || 0;
        
        partition[index].status = 'failed';
        danceMove('normal');
        updateArrow(index, 'failed');
        sendNotePlayed(false, 0,index);
    }

    function calculateResultBoard(results, trackName){
          var currentPlayerResult = results[session['playerSocketId']];
              
            $.post("lib/saveResults.php", { session: session, currentPlayerResult: currentPlayerResult, trackName: trackName  }, function(data){
            });

          var totalScoreCurrentPlayer = (Math.round(100 / trackInfos['maximum_points']*currentPlayerResult['totalSuccess'])*100)/100;
          $('#resultBoard .totalScoreCurrentPlayer').text(totalScoreCurrentPlayer+'%');
          $('#resultBoard table').empty();
          for(var playerResult in results) {
            var totalScoreCurrentPlayer = (Math.round(100 / trackInfos['maximum_points']*results[playerResult]['totalSuccess'])*100)/100;
            var difficultyCurrentPlayer = results[playerResult]['difficulty']
            $('#resultBoard table').append('<tr><td>'+results[playerResult]['displayName']+'</td><td>'+totalScoreCurrentPlayer+'%</td><td>'+difficultyCurrentPlayer+'</td></tr>');
          }

          showResultBoard(results);
    }
            



    function updateScores(infoRoom){
        var totalPointsPlayer = infoRoom['playerList'][session['playerSocketId']]['totalPoints'];
        var totalSuccess = infoRoom['playerList'][session['playerSocketId']]['totalSuccess'];

        updateJauge(100/trackInfos['maximum_points']*totalSuccess); 
}

    function controlTicker() {
        //Test des contrôles appuyés

        if(controlPressed != '') {
            pressCursor();
            danceMove(controlPressed);
            var resultPressed = {sucess:false, difference:0, index:0};
            var difference;
            for(key in partition) {
                if(currentTime-margeErreur <= partition[key]['time'] && controlPressed == partition[key]['direction'] && partition[key]['status'] === 'playable') {
                    var difference = Math.abs(partition[key]['time'] - currentTime);
                    if(difference < margeErreur){
                        resultPressed.sucess = true;
                        resultPressed.difference = difference;
                        resultPressed.index = key;
                    }else{
                        resultPressed.index = key;
                    }
                    break;
                }
            }
            if(resultPressed.sucess){
                successNote(resultPressed.difference, resultPressed.index);
            }else{
                failNote(resultPressed.index);
            }
            controlPressed = '';
        }
    }