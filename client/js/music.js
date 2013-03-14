	var queue;
	var displayStatus;
	var music;
	var playerTicker;
	var clicksPerBar;
	var clicksMarks = Array();
	var pauseTime = 0;
	var beat = 0;
	var timeDelay = 1;
	var musicThread;
	var currentIndexMark;
	var currentTime;
	var loader;
	var currentTrack;
	var trackAlreadyLoaded = [];
	var assetsAudioPath = createjs.Sound.BASE_PATH = './audio/';
	var isMuted;


	function initMusic() {

	}

	function prepareMusic(trackName) {		
		if(currentTrack === trackName){
			trackPreloaded();
		}else{
			currentTrack = trackName;
			if($.inArray(trackName, trackAlreadyLoaded) === -1){
				var manifest = [
                	{src:assetsAudioPath+trackName+".mp3|"+assetsAudioPath+trackName+".ogg", id:currentTrack}
                ]
                createjs.Sound.addEventListener("loadComplete", createjs.proxy(trackLoaded, this));
            	createjs.Sound.registerManifest(manifest);
			}
			else{
				showStartButton();
			}

		}
	}

	function trackLoaded(){
		trackAlreadyLoaded.push(currentTrack);
		trackPreloaded();
	}


	function startMusic() {
		currentIndexMark = 0;
		musicThread=setInterval(musicTicker,1);

		playSound(currentTrack);

		startDance(trackInfos['overall_tempo']);
	}

	function stopMusic() {
		clearInterval(musicThread);
		if (queue != null) { queue.cancel(); }
		createjs.Sound.stop();
		createjs.Sound.removeAllEventListeners();

	}

	function setVolumeMusic(volume) {
		music.setVolume(volume);	
	}

	function toggleMute() {
		isMuted = !music.muted;
		music.mute(isMuted);
	}

	function musicTicker(){
		currentTime = getCurrentTime();
	  	if(partition[currentIndexMark] != undefined && currentTime >= partition[currentIndexMark]['time']-timeDelay){
		  	partition[currentIndexMark]['status'] = 'playable';
		  	newArrow(currentIndexMark, partition[currentIndexMark]['direction']);
	  		currentIndexMark++;
		}

	}

	
	function handleComplete(){
		endGame();
	}

	

	function getCurrentTime() {
		var currentPositionMs = Math.round(music.getPosition()/1000*1000)/1000;
		return currentPositionMs;
	}


	function playSound(name) {
		music = createjs.Sound.play(name);  // play using id.  Could also use source.
		music.mute(isMuted);
		music.addEventListener("complete", handleComplete);
		music.play();
	}


