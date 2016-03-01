/**
 * [Piece description]
 * @param {[type]} s [description]
 * @param {[type]} c [description]
 */
var Piece = function(s, c) {
	if (typeof s != "string") throw "Invalid argument";

	if (s.length == 2) return new Piece(s[0], (s[1]=="+"||s[1]=="1")?true:((s[1]=="-"||s[1]=="0")?false:undefined));
	else if (s.length != 1) throw "Invalid argument";

	if (typeof Piece.defaults[s = s.toUpperCase()] == "undefined") throw "new Piece() : "+s+" is not valid Piece";
	var v = Piece.defaults[s];
	this.clr       = (!!c);
	this.char      = v.c;
	this.move_func = v.mf;
	this.icon      = v.genIcon(this.clr);
	this.valid_matrix = v.validMatrix;


	this.toString = function() { return this.char+(this.clr?'1':'0'); }
};
Piece.defaults = {
	  "P": { c : "P", mf : function(p1,p2) { // Pawn - Sotilas
	  	console.error("Movement not implemented yet to Pawn", arguments);
		return (p1.x == p2.x) && ((this.clr === true)?((p1.y == 6 && p1.y - p2.y == 2) || (p1.y - p2.y == 1)):((p1.y == 1 && p2.y - p1.y == 2) || (p2.y - p1.y == 1)))
	  }, genIcon     : function(clr) { return clr ? "&#9817;" : "&#9823;" }
	   , validMatrix : function(p, matrix, arr) {
	   		for(var arr = [], y = 0; y < 8 && arr.push([]); y++) for(var x = 0; x < 8; x++) arr[y].push(false);
	   		function tp(x,y) { if (x<0||y<0||x>7||y>7)return; if (matrix[y][x] instanceof Piece) return (arr[y][x] = (matrix[y][x].clr !== this.clr)) != 1337; else arr[y][x] = true; };
	   		if (matrix[p.y][p.x].clr)
	   		     { if (!tp.call(this, p.x, p.y-1) && p.y==6) tp.call(this, p.x, p.y-2); }
	   		else { if (!tp.call(this, p.x, p.y+1) && p.y==1) tp.call(this, p.x, p.y+2); }
	   		return arr;
	  } } // Sotilas
	, "R": { c : "R", mf : function(p1,p2) { // Rook - Torni
		return (p1.x == p2.x || p1.y == p2.y );
	  }, genIcon     : function(clr) { return clr ? "&#9814;" : "&#9820;" }
	   , validMatrix : function(p, matrix) {
	   		for(var arr = [], y = 0; y < 8 && arr.push([]); y++) for(var x = 0; x < 8; x++) arr[y].push(false);
	   		function tp(x,y) { if (matrix[y][x] instanceof Piece) return (arr[y][x] = (matrix[y][x].clr !== this.clr)) != 1337; else arr[y][x] = true; };
	   		for(var x=p.x+1,y=p.y; x < 8; x++)  if (tp.call(this, x, y)) break;
	   		for(var x=p.x-1,y=p.y; x >= 0; x--) if (tp.call(this, x, y)) break;
	   		for(var y=p.y+1,x=p.x; y < 8; y++)  if (tp.call(this, x, y)) break;
	   		for(var y=p.y-1,x=p.x; y >= 0; y--) if (tp.call(this, x, y)) break;
	   		return arr;
	  } } // Torni
	, "N": { c : "N", mf : function(p1,p2) { // Knight - Ratsu
		return (Math.abs(p1.x - p2.x) == 1 && Math.abs(p1.y - p2.y) == 2) || (Math.abs(p1.x - p2.x) == 2 && Math.abs(p1.y - p2.y) == 1);
	  }, genIcon     : function(clr) { return clr ? "&#9816;" : "&#9822;" }
	   , validMatrix : function(p, matrix) {
	   		for(var arr = [], y = 0; y < 8 && arr.push([]); y++) for(var x = 0; x < 8; x++) arr[y].push(false);
	   		function tp(x,y) { if (x<0||y<0||x>7||y>7)return; if (matrix[y][x] instanceof Piece) return (arr[y][x] = (matrix[y][x].clr !== this.clr)) != 1337; else arr[y][x] = true; };
	   		tp.call(this, p.x-2, p.y-1); tp.call(this, p.x-1, p.y-2);
	   		tp.call(this, p.x+2, p.y-1); tp.call(this, p.x+1, p.y-2);
	   		tp.call(this, p.x+2, p.y+1); tp.call(this, p.x+1, p.y+2);
	   		tp.call(this, p.x-2, p.y+1); tp.call(this, p.x-1, p.y+2);
	   		return arr;
	  } } // Ratsu
	, "B": { c : "B", mf : function(p1,p2) { // Bishop - Lähetti
		return (Math.abs((p1.y-p2.y) / (p1.x - p2.x)) == 1);
	  }, genIcon     : function(clr) { return clr ? "&#9815;" : "&#9821;" }
	   , validMatrix : function(p, matrix) {
	   		for(var arr = [], y = 0; y < 8 && arr.push([]); y++) for(var x = 0; x < 8; x++) arr[y].push(false);
	   		function tp(x,y) { if (matrix[y][x] instanceof Piece) return (arr[y][x] = (matrix[y][x].clr !== this.clr)) != 1337; else arr[y][x] = true; };
	   		for(var x=p.x+1,y=p.y+1; x < 8 && y < 8; x++,y++)  if (tp.call(this, x, y)) break;
	   		for(var x=p.x+1,y=p.y-1; x < 8 && y >=0; x++,y--)  if (tp.call(this, x, y)) break;
	   		for(var x=p.x-1,y=p.y-1; x >=0 && y >=0; x--,y--)  if (tp.call(this, x, y)) break;
	   		for(var x=p.x-1,y=p.y+1; x >=0 && y < 8; x--,y++)  if (tp.call(this, x, y)) break;
	   		return arr;
	  } } // Lähetti
	, "Q": { c : "Q", mf : function(p1,p2) { // Queen - Kuningatar
		return (Math.abs((p1.y-p2.y) / (p1.x - p2.x)) == 1 || p1.x == p2.x || p1.y == p2.y );
	  }, genIcon     : function(clr) { return clr ? "&#9813;" : "&#9819;" }
	   , validMatrix : function(p, matrix) {
	   		for(var arr = [], y = 0; y < 8 && arr.push([]); y++) for(var x = 0; x < 8; x++) arr[y].push(false);
	   		function tp(x,y) { if (matrix[y][x] instanceof Piece) return (arr[y][x] = (matrix[y][x].clr !== this.clr)) != 1337; else arr[y][x] = true; };
	   		for(var x=p.x+1,y=p.y; x < 8; x++)  if (tp.call(this, x, y)) break;
	   		for(var x=p.x-1,y=p.y; x >= 0; x--) if (tp.call(this, x, y)) break;
	   		for(var y=p.y+1,x=p.x; y < 8; y++)  if (tp.call(this, x, y)) break;
	   		for(var y=p.y-1,x=p.x; y >= 0; y--) if (tp.call(this, x, y)) break;
	   		for(var x=p.x+1,y=p.y+1; x < 8 && y < 8; x++,y++)  if (tp.call(this, x, y)) break;
	   		for(var x=p.x+1,y=p.y-1; x < 8 && y >=0; x++,y--)  if (tp.call(this, x, y)) break;
	   		for(var x=p.x-1,y=p.y-1; x >=0 && y >=0; x--,y--)  if (tp.call(this, x, y)) break;
	   		for(var x=p.x-1,y=p.y+1; x >=0 && y < 8; x--,y++)  if (tp.call(this, x, y)) break;
	   		return arr;
	  } } // Kuningatar
	, "K": { c : "K", mf : function(p1,p2) { // King - Kuningas
		return ((Math.abs(p1.x - p2.x) <= 1) && (Math.abs(p1.y - p2.y) <= 1));
	  }, genIcon     : function(clr) { return clr ? "&#9812;" : "&#9818;" }
	   , validMatrix : function(p, matrix) {
	   		for(var arr = [], y = 0; y < 8 && arr.push([]); y++) for(var x = 0; x < 8; x++) arr[y].push(false);
	   		function tp(x,y) { if (x<0||y<0||x>7||y>7)return; if (matrix[y][x] instanceof Piece) return (arr[y][x] = (matrix[y][x].clr !== this.clr)) != 1337; else arr[y][x] = true; };
	   		for(var y = -1; y <= 1; y++) for(var x = -1; x <= 1; x++) tp.call(this, p.x+x, p.y+y);
	   		return arr;
	  } } // Kuningas
};

/**
 * [Board description]
 * @param {[type]} dump [description]
 */
var Board = function(dump) {
	this.ctime = new Date();
	this.stime = null;

	this.history = [];

	this.start = function() { this.stime = new Date(); };

	this.matrix = Board.genEmpty();

	if (typeof dump == "string") {
		dump = JSON.parse(dump);
		// Läpikä dumppi
	}
};
Board.prototype.move = function(move) {
	if (!(move instanceof Chess.Move)) throw "Only Move can be move";
	var t = this.matrix[move.to.y][move.to.x];
	this.matrix[move.to.y][move.to.x] = this.matrix[move.from.y][move.from.x];
	this.matrix[move.from.y][move.from.x] = null;

	this.history.push(move);
	return t;
}
Board.prototype.toString = function() {
	return JSON.stringify(this.matrix);
};
Board.prototype.getContent = function(x, y) {
	// TODO: laajenna, tarkistuksia, ties mitä
	return this.matrix[y][x];
};
Board.genEmpty = function() {
	var m = [];
	for(var y = 0; y < 8; y++) {
		m[y] = [];
		for(var x = 0; x < 8; x++) m[y][x] = null;
	}
	m[0][0] = new Piece("R0"); m[7][0] = new Piece("R1");
	m[0][1] = new Piece("N0"); m[7][1] = new Piece("N1");
	m[0][2] = new Piece("B0"); m[7][2] = new Piece("B1");
	m[0][3] = new Piece("Q0"); m[7][3] = new Piece("Q1");
	m[0][4] = new Piece("K0"); m[7][4] = new Piece("K1");
	m[0][5] = new Piece("B0"); m[7][5] = new Piece("B1");
	m[0][6] = new Piece("N0"); m[7][6] = new Piece("N1");
	m[0][7] = new Piece("R0"); m[7][7] = new Piece("R1");
	for(var i = 0; i < 8; i++)
		{ m[1][i] = new Piece("P0");
		  m[6][i] = new Piece("P1"); }
	return m;
};

/**
 * [Chess description]
 */
var Chess = function() {
	this.board = new Board();
	this.current_turn = true;
	this.players = [];
};
Chess.prototype.setPlayer = function(i, v) {
	if (v != null && !(v instanceof Chess.AI)) throw "Only human or ai can play";
	this.players[i] = v;
};
Chess.prototype.move = function(move) {
	if (arguments[0] instanceof Chess.Square && arguments[1] instanceof Chess.Square) return this.move(new Chess.Move(arguments[0], arguments[1], this.getPiece(arguments[0]), this.getPiece(arguments[1])));
	if (!(move instanceof Chess.Move)) throw "Only Move can be move";

	if (move.piece.move_func(move.from, move.to, move.piece))
		return this.board.move(move);
	else throw "Invalid move";
}
Chess.prototype.getPiece = function(square) {
	if (!(square instanceof Chess.Square)) throw "Square only square";
	return this.board.getContent(square.x, square.y);
}

Chess.PlayerState = function() {

}

/**
 * [Square description]
 * @param {[type]} str [description]
 */
Chess.Square = function(x, y) {
	if (typeof x == "string" && x.length == 2) { var p = Chess.Square.strToPos(x); return new Chess.Square(p.x, p.y); }
	else if (!(typeof x == "number" && typeof y == "number")) throw "Invalid arguments";

	if (x < 0 || x > 7 || y < 0 || y > 7) throw "Invalid coordinates";

	this.str = Chess.Square.posToStr(x, y);
	this.x   = x;
	this.y   = y;

	this.toString = function() { return this.str; };
};

Chess.Square.strToPos = function(str) {
	if (str.length != 2) "Square have only 2 characters";
	var p = { x : str[0].toLowerCase().charCodeAt()-97
	        , y : 8 - parseInt(str[1]) };
	if (p.x < 0 || p.y < 0 || p.x > 7 || p.y > 7) return null;
	return p;
}
Chess.Square.posToStr = function(x, y)
	{ return String.fromCharCode(97 + x) + "" + (8 - y) };

/**
 * [Move description]
 * @param {[type]} from [description]
 * @param {[type]} to   [description]
 */
Chess.Move = function(from, to, piece, t_piece) {
	if (typeof from == "string") return new Chess.Move(piece, new Chess.Square(from), to);
	if (!(from instanceof Chess.Square)) throw "Only Move can be from-square in Move";
	this.from  = from;

	if (typeof to == "string") return new Chess.Move(piece, from, new Chess.Square(to));
	if (!(to instanceof Chess.Square)) throw "Only Square can be to-square in Move";
	this.to    = to;

	if (typeof piece == "string") return new Chess.Move(new Chess.Piece(piece), from, to);
	if (!(piece instanceof Chess.Piece)) throw "Only Piece can be moved";
	this.piece = piece;

	if (!!t_piece && !(t_piece instanceof Chess.Piece)) throw "Only Piece can be moved to";
	this.t_piece = (t_piece instanceof Chess.Piece) ? t_piece : null;

}
Chess.Move.prototype.toString = function(chess) {
	var c = this.piece.char == "P" ? "" : this.piece.char;
	if (this.t_piece == null) {
		return  c + "" + this.from.toString()
		+ " " + c + "" + this.to.toString();
	} else {
		return  c + "x" + this.from.toString()
		+ " " + c + "x" + this.to.toString();
	}
};
Chess.Move.fromString = function(str) {

};



Chess.Piece = Piece;
Chess.Board = Board;


/**
 * 
 */
Chess.AI = function(clr) {
	this.clr = clr;	
};
Chess.AI.makeMove = function (board) {
	var pieces = [];
	for(var y in board.matrix) {
		for(var x in board.matrix[y]) {
			if (board.matrix[y][x].clr == this.clr) pieces.push(board.matrix[y][x]);
		}
	}
};