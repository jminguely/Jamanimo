	
	var preloadQueue;
	var queue;
	var preloadQueueLength;
	var preloadQueueLoadedLength;

	function stop() {
            if (preload != null) { preload.close(); alert("preloader closed..."); }
        }
    function loadAll(items) {
    	$('#loader').show();
    	preloadQueue = items;

    	preloadQueueLoadedLength = 0;
    	preloadQueueLength = preloadQueue.length;
    	$('#loader #status span').text('0%');

        while (preloadQueue.length > 0) {
            loadAnother();
        }
    }
    function loadAnother() {
        // Get the next manifest item, and load it
        item = preloadQueue.shift();
        preloadItems(item, false);
    }


	function preloadItems(item, isMusic) {
		// Instantiate a queue.
		queue = new createjs.PreloadJS();
		if(isMusic) queue.installPlugin(createjs.SoundJS);
		queue.onComplete = preloadComplete;
		queue.onFileError = handleFileError;
		queue.onProgress = handleProgress;
		queue.onLoadStart = handleLoadStart;

		queue.loadFile(item, true);
	}


	function handleLoadStart(){
	}

	function handleFileError(o) {
		// An error occurred.
	} 

	function handleProgress(event) {
		// Progress happened.
	}

	function preloadComplete() {
		preloadQueueLoadedLength++;

		$('#loader #status span').text(Math.round(100/preloadQueueLength*preloadQueueLoadedLength)+'%');
		
		if(preloadQueueLoadedLength == preloadQueueLength){
        	$('#frame').fadeIn(500);
			$('#loader').fadeOut(100);
		}
	}
	