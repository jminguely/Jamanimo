var arrowStage;
var canvasThread;

var fps = 50;
var animationEachFPS = 0;

//mvpf, mouvement en pixels par frame.
var mvpfX;
var mvpfY;

var imgSeq = new Image();		// The image for the arrow animation
var arrowBmp;		
				// The animated arrow template to clone
var cursorAnimation;
var cursorGlow;

var characterAnimation;

var characterStage;
var stateStage;

var paused;

var jauge;

var dimensionArrowCanvas = {minX: 0,maxX:0,minY: 0,maxY:0,centerX: 0,centerY:0}; 

var spriteSheetArrow = new createjs.SpriteSheet({
	    images: ["img/game/arrow.png"],
		frames: {width:48, height: 50, regX: 24, regY: 25}, 
	    animations: {
			up: [0],
			right: [1],
			left: [2],
			down: [3]
	    }
	});

var cursorSpriteSheet = new createjs.SpriteSheet({
		// image to use
		images: ["img/game/cursor.png"],
		// width, height & registration point of each sprite
		frames: {width: 50, height: 50, regX: 25, regY: 25}, 
		animations: {    
			normal: [0],
			pressed: [1]
		}
});

function createCharacter(characterName){
	var characterSpriteSheet = new createjs.SpriteSheet({
		// image to use
		images: ["img/characters/"+characterName+"/dance.png"],
		// width, height & registration point of each sprite
		frames: {width: 300, height: 300, regX: 150, regY: 150}, 
		animations: {   
			pause: [0], 
			normal: [0,7, 'pause'],
			down: [8,12, 'pause'],
			right: [13,17, 'pause'],
			up: [18,22, 'pause'],
			left: [23,27, 'pause']
		}
	});
	// create a BitmapAnimation instance to display and play back the sprite sheet:
	characterAnimation = new createjs.BitmapAnimation(characterSpriteSheet);

	// start playing the first sequence:
	characterAnimation.gotoAndPlay("pause");     //animate

	characterAnimation.name = "sprite";

	characterAnimation.x = 200;
	characterAnimation.y = 200;

	return characterAnimation;
}

function startDance(tempo){
	var danceTicker = setInterval(function(){
		characterStage.update();
	}, 60/tempo*200);
}

function danceMove(move){
	if(!isPaused){
		characterAnimation.gotoAndPlay(move);
		characterAnimation.currentFrame = 0;
	}
	
}

function initCanvas() {
	// create a new arrowStage and point it at our canvas:
	var arrowCanvas = document.getElementById("arrowCanvas");
	arrowStage = new createjs.Stage(arrowCanvas);

	var cursorCanvas = document.getElementById("cursorCanvas");
	cursorStage = new createjs.Stage(cursorCanvas);

	var characterCanvas = document.getElementById("characterCanvas");
	characterStage = new createjs.Stage(characterCanvas);

	var stateCanvas = document.getElementById("stateCanvas");
	stateStage = new createjs.Stage(stateCanvas);

	//Initiation des dimensions du canvas
	dimensionArrowCanvas.maxX = arrowCanvas.height;
	dimensionArrowCanvas.centerX = dimensionArrowCanvas.maxX / 2;
	dimensionArrowCanvas.maxY = arrowCanvas.width;
	dimensionArrowCanvas.centerY = dimensionArrowCanvas.maxY / 2;


	//Initiation des vitesses de pixels par frames
	mvpfX = dimensionArrowCanvas.centerX / fps / timeDelay;
	mvpfY = dimensionArrowCanvas.centerY / fps / timeDelay;

	cursorGlow = new createjs.Shape(
		new createjs.Graphics().beginFill("#62cc29").drawEllipse(dimensionArrowCanvas.centerX, dimensionArrowCanvas.centerY, 48, 48)
	);
	cursorGlow.regX = 24;
	cursorGlow.regY = 24;

	cursorStage.addChild(cursorGlow);

	// create a BitmapAnimation instance to display and play back the sprite sheet:
	cursorAnimation = new createjs.BitmapAnimation(cursorSpriteSheet);
	cursorAnimation.gotoAndPlay("normal");     //animate
	cursorAnimation.name = "cursor";
	cursorAnimation.x = dimensionArrowCanvas.centerX;
	cursorAnimation.y = dimensionArrowCanvas.centerY;
	cursorStage.addChild(cursorAnimation);

	arrowBmp = new createjs.BitmapAnimation(spriteSheetArrow);

	jauge = new createjs.Shape();
	stateStage.addChild(jauge);

	srcImageJauge = new Image();
	srcImageJauge.src = "img/game/jauge.png";
	jaugeMask = new createjs.Bitmap(srcImageJauge);
	jaugeMask.y = 20;
	stateStage.addChild(jaugeMask);
}

function updateJauge(ratio){
    var barFull = Math.round(350/100*ratio)+38;

	var totalEmpty = 350 - barFull + 43;
    if(totalEmpty<43) totalEmpty = 43;
       
    jauge.graphics.clear().beginFill('rgba(109,37,59,0.8)').drawRect(15, totalEmpty, 30, barFull);
    stateStage.update();
}

function showText(text){
    var txt = new createjs.Text(text, "60px Acme", "#62cc29");

    txt.regX = text.length*10;
    txt.regY = 18;

    txt.x = dimensionArrowCanvas.centerX;
	txt.y = dimensionArrowCanvas.centerY - 100;

	txt.rotation = Math.random()*30-15;

    txt.alpha = 0;
    createjs.Tween.get(txt,{loop:false}) .to({alpha:1},100) .wait(200) .to({alpha:0},200);

    cursorStage.addChild(txt);
}


function startCanvas(){
	isPaused = false;
	createjs.Ticker.setFPS(fps);
	createjs.Ticker.addListener(window);
}

function initGame(){
	updateJauge(0);
	characterAnimation = createCharacter(session['character']);
	characterStage.addChild(characterAnimation);
	jauge.graphics.beginFill('rgba(109,37,59,0.8)').drawRect(15, 43, 30, 350);
}

function stopCanvas(){
	isPaused = true;
	createjs.Ticker.removeListener(window);
	cleanCanvas();
}

function cleanCanvas(){
	arrowStage.removeAllChildren();
	characterStage.removeAllChildren();
	arrowStage.update();
}

function togglePauseCanvas() {
	isPaused = !isPaused;
}

function tick() {
	// loop through all of the active arrows on arrowStage:
	var l = arrowStage.getNumChildren();
	for (var i=0; i<l; i++) {
		element = arrowStage.getChildAt(i);
		if(element != undefined && element.status != 'failed'){

			switch(element.direction){
				case 'up':
					element.y = element.y+mvpfY;
					if(element.y >= dimensionArrowCanvas.centerY){
						failNote(element.indexPartition);
					}
				break;
				case 'down':
					element.y = element.y-mvpfY;
					
					if(element.y <= dimensionArrowCanvas.centerY){
						failNote(element.indexPartition);
					}
				break;
				case 'left':
					element.x = element.x+mvpfX;
					if(element.x >= dimensionArrowCanvas.centerX){
						failNote(element.indexPartition);
					}
				break;
				case 'right':
					element.x = element.x-mvpfX;
					if(element.x <= dimensionArrowCanvas.centerX){
						failNote(element.indexPartition);
					}
				break;
			}
			
		}
		if(element === undefined || element.status == 'out'){
			arrowStage.removeChildAt(i);
		}

	}
	// draw the updates to arrowStage
	arrowStage.update();
	cursorStage.update();
}


function newArrow(index, direction) {
	if(!isPaused){
	
		var arrow = arrowBmp.clone();

		arrow.status = 'processing';
		arrow.direction = direction;
		arrow.indexPartition = index;
		switch(direction){
			case 'up':
				arrow.x = dimensionArrowCanvas.centerX;
				arrow.y = dimensionArrowCanvas.minY;
				arrow.gotoAndPlay('up');
			break;
			case 'down':
				arrow.x = dimensionArrowCanvas.centerX;
				arrow.y = dimensionArrowCanvas.maxY;
				arrow.gotoAndPlay('down');
			break;
			case 'left':
				arrow.x = dimensionArrowCanvas.minX;
				arrow.y = dimensionArrowCanvas.centerY;
				arrow.gotoAndPlay('left');
			break;
			case 'right':
				arrow.x = dimensionArrowCanvas.maxX;
				arrow.y = dimensionArrowCanvas.centerY;
				arrow.gotoAndPlay('right');
			break;
		}
		arrow.alpha = 0;

		// start the animation on a random frame:
		

		// add to the display list:

		createjs.Tween.get(arrow,{loop:false}) .to({alpha:1},(timeDelay*1000)-200, createjs.Ease.quadOut)

		arrowStage.addChild(arrow);
	}
}


function updateArrow(index, status){
	var l = arrowStage.getNumChildren();
	for (var i=0; i<l; i++) {
		element = arrowStage.getChildAt(i);
		elementIndex = element.indexPartition;

		if(element['indexPartition'] != undefined && parseInt(element['indexPartition']) === parseInt(index)){
			element.status = status;
			arrowStage.children[i].status = status;
			if(arrowStage.children[i].status == 'success'){
				arrowStage.removeChildAt(i);
			}else if(arrowStage.children[i].status == 'failed'){

				var targX = Math.random() * dimensionArrowCanvas.maxX;
				var targY = Math.random() * dimensionArrowCanvas.maxY;

				switch(element.direction){
					case 'right':
						targX = dimensionArrowCanvas.maxX+30;
					break;
					case 'left':
						targX = dimensionArrowCanvas.minX-30;
					break;
					case 'up':
						targY = dimensionArrowCanvas.minY-30;
					break;
					case 'down':
						targY = dimensionArrowCanvas.maxY+30;
					break;
				}
				// var targY = Math.random()*dimensionArrowCanvas.maxY*2-dimensionArrowCanvas.maxY;
				createjs.Tween.get(element, {loop:false})
					.to({x:targX, y:targY, rotation:-360, alpha:0, scaleX: 0.4, scaleY: 0.4}, 200, createjs.Ease.bounceOut)
					.call(function(){
						if(arrowStage.children[i] != undefined){
							arrowStage.children[i].status = 'out';
						}
					})
			}
			break;
		}
	}
}

function pressCursor(){
	cursorAnimation.gotoAndPlay("pressed");
	cursorStage.update();
	setTimeout(function(){
		cursorAnimation.gotoAndPlay("normal");
	},100);	
}

function pressCursorSuccess(){
	createjs.Tween.get(cursorGlow, {loop:false})
					.to({scaleX: 1.2, scaleY: 1.2, regX: 57, regY: 57}, 100, createjs.Ease.bounceOut)
					.to({scaleX: 1, scaleY: 1, regX: 24, regY: 24}, 100, createjs.Ease.bounceOut)
	
}