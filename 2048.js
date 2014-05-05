
const SLIDE_UP = 1;
const SLIDE_DOWN = 2;
const SLIDE_RIGHT = 3;
const SLIDE_LEFT = 4;

function g2048(){
	this.counter = 0;
	this.score = 0;
	this.offset = 0;
	this.tiles = Array(4);
	this.befcopy;
	for(var i=0;i<4;i++){this.tiles[i] = [0,0,0,0]}
}

g2048.prototype.testloop = function(){
	this.init();
	do{
		var mod = (this.counter+this.offset)%4;
		this.step(mod+1);
		this.output();
	}while(!this.isGameover())
	console.log("gameover");
}

g2048.prototype.init = function(){
	this.allocate();
	this.allocate();
	this.befcopy = clone(this.tiles);
}

g2048.prototype.step = function(v){
	this.befcopy = clone(this.tiles);
	this.slide(v);
	if(this.isChanged()){
		this.counter++;
		this.allocate();
		return true;
	}else{
		this.offset++;
		return false;
	}
}

g2048.prototype.slide = function(v){
	var nullfunc = function(tls){return tls};
	var func = {
		1:[zip,zip],
		2:[zipreverse,reversezip],
		3:[reverse,reverse],
		4:[nullfunc,nullfunc],
	}
	var fset = func[v];
	this.tiles = fset[0](this.tiles);
	for(var i=0;i<4;i++){
		this.tiles[i] = this.plus(this.tiles[i]);
		this.tiles[i] = this.plug(this.tiles[i]);
	}
	this.tiles = fset[1](this.tiles);
}

g2048.prototype.isChanged = function(){
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++)
			if(this.tiles[i][j] != this.befcopy[i][j])
				return true;
	return false;

}

g2048.prototype.plus = function(vec){
	if(vec.length<2)
		return vec;
	var nowi = 0;
	for(var i=1;i<vec.length;i++){
		var v = vec[i];
		if(v==0)
			continue;
		if(vec[nowi]==vec[i]){
			var nt = vec[nowi]*2;
			vec[nowi] = nt;
			this.score += nt
				vec[i] = 0;
			nowi = i;
		}
		else
			nowi = i;
	}
	return vec;
}


g2048.prototype.plug = function(vec){
	var res = [];
	for(var i=0;i<vec.length;i++){
		if(vec[i]!=0)
			res.push(vec[i]);
	}
	var offset = vec.length-res.length;
	var offseta = new Array(offset);
	for(var i=0;i<offset;i++)
		offseta[i] = 0;
	return res.concat(offseta);

}

g2048.prototype.isGameover = function(){
	var l = this.tiles.length;
	if(this.tiles[l-1][l-1] == 0)
		return false;

	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			var v = this.tiles[i][j];
			var vi1 = this.tiles[i+1][j];
			var vj1 = this.tiles[i][j+1]
				if(v==0 || vi1==0 || vj1== 0 || v==vi1 || v==vj1)
					return false;
		}
	}
	for(var i=0;i<3;i++){
		if(this.tiles[l-1][i] == this.tiles[l-1][i+1] || this.tiles[i][l-1] == this.tiles[i+1][l-1])
			return false;
	}

	return true;
}


g2048.prototype.output = function(){
	console.log("------------------------");
	console.log("Counter:"+this.counter.toString());
	console.log("Score:"+this.score.toString());
	for(var i=0;i<this.tiles.length;i++)
		console.log(this.befcopy[i]);
	console.log("");

	for(var i=0;i<this.tiles.length;i++)
		console.log(this.tiles[i]);
}

g2048.prototype.allocate = function(){
	var nulltiles = this.nullTile();
	if(nulltiles == 0)
		return;
	var p = choose(nulltiles);
	this.tiles[p[0]][p[1]] = this.newNum();
}


g2048.prototype.newNum = function(){
	var fourprob = 0.2;
	if(Math.random() < 0.2)
		return 4;
	return 2;
}

g2048.prototype.nullTile = function(){
	var res = []
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(this.tiles[i][j] == 0)
					res.push([i,j]);
			}
		}
	return res;
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
	return res;
}

function choose(ls){
	return ls[Math.floor(Math.random()*ls.length)]
}

function zip(tls){
	var res =[];
	for(var i=0;i<tls[0].length;i++){
		var l = []
			for(var j=0;j<tls.length;j++){
				l.push(tls[j][i]);	
			}
		res.push(l);
	}
	return res;
}

function reverse(tls){
	for(var i=0;i<tls.length;i++)
		tls[i].reverse();
	return tls;
}

function zipreverse(tls){
	return reverse(zip(tls));
}

function reversezip(tls){
	return zip(reverse(tls));
}


if(require.main === module){
	var game = new g2048();
	game.testloop();
}

module.exports.g2048 = g2048;
