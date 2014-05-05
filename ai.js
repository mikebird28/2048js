
var gamejs = require("./2048.js");

mainloop();

function dcopy(v){
	return JSON.parse(JSON.stringify(v));
}

function mainloop(){
	var game = new gamejs.g2048();
	game.init();
	decideV(game);

	do{
		var v = decideV(game); 
		game.step(v);
		game.output();
	}while(!game.isGameover())
	console.log("gameover");
	game.output()
}

function decideV(game){
	var mv = 0;
	var mscore = 0;
	for(var i=1;i<5;i++){
		var gc = cloneGame(game);
		var score = 0;
		if(gc.step(i)){
			var p = pointMaxN(gc);
			for(var j=0;j<50;j++){
				gc2 = cloneGame(gc);
				score += playrandom(gc2).score;
			}
			if(mscore<score){
				mscore = score;
				mv = i;
			}
		}else{
			continue;
		}
	}
	return mv;
}


function playrandom(game){
	do{
		var v = Math.ceil(Math.random()*4);
		game.step(v);
	}while(!game.isGameover())
	return game;
}

function pointMaxN(game){
	var maxN = 0;
	var maxP = [0,0];
	for (var i=0;i<game.tiles.length;i++){
		for(var j=0;j<game.tiles[0].length;j++){
			var v = game.tiles[i][j];
			if(maxN < v){
				maxN = v;
				maxP = [i,j];
			}
		}			
	}
	return maxP;
}

function isCorner(p){
	var s = p.toString();
	if(s == [0,0].toString() || s == [0,3].toString() || s == [3,0].toString() || s == [3,3].toString())
		return true;
	return false;
}

function cloneGame(game){
	var n = new gamejs.g2048();
	n.counter = game.counter;
	n.score = game.score;
	n.offset = game.offset;
	n.tiles = clone(game.tiles);
	n.befcopy = clone(game.befcopy);
	return n;	
}

function clone(tls){
	var x = tls.length;
	var y = tls[0].length;
	var res = new Array(x);
	for(var i=0;i<x;i++)
		res[i] = new Array(y);
	for(var i=0;i<x;i++)
		for(var j=0;j<y;j++)
			res[i][j] = tls[i][j];
	return res
}



