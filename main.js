var Game = function(e_container) {

	this.e_container = $(e_container);
	this.e_board     = $(" > .board", this.e_container);

	this.player = true;
	this.chess = null;
	this.turn = null;

	this.selected = null;

	this.players = [];

	this.render_activate = false;
};
Game.prototype.start = function() {
}
Game.prototype.setPlayer = function(b, v) {
	this.players[!!b ? 1 : 0] = v;
}
Game.prototype.move = function(from, to) {
	if (!(from instanceof Chess.Square && to instanceof Chess.Square)) throw "Only Squares can build Move";
	var r
	  , piece   = this.chess.getPiece(from)
	  , t_piece = this.chess.getPiece(to);

	if (piece == null) return;
	if (piece.clr != this.player)                return console.error("you can not move this");
	if (!!t_piece && t_piece.clr == this.player) return console.error("You can't eat own piece");

	var move = new Chess.Move(from, to, piece, t_piece);

	try {
		this.chess.move(move);
	} catch(e) {
		console.log("Virheellinen siirto "+move.toString());
		return;
	}

	if (t_piece instanceof Chess.Piece) this.e_container.trigger("capture", move);

	if (this.render_activate) this.render();

	this.e_container.trigger("move", move);
};
Game.prototype.init = function() {
	this.initDOM(this.e_board);
	this.chess = new Chess();
};
Game.prototype.initDOM = function() {
	var self = this;
	this.e_board.empty().addClass("chess-board");
	var cols = "abcdefgh".split("")
	  , row = $("<tr>");
	for(var x = -1; x <= 8; x++) {
		var classes = 'ts header column-header';
		if (x == -1) classes += " header-top-left corner";
		if (x == 8) classes += " header-top-right corner";
		row.append($("<th class='"+classes+"'>").attr("data-column",cols[x]).attr("data-column-index",x).html(cols[x]));
	}
	this.e_board.append(row);
	for(var y = 0; y < 8; y++) {
		row = $("<tr>").attr("data-row",8-y).attr("data-row-index",y);
		row.append($("<th class='ts header row-header column-"+0+" row-"+y+"'>").attr("data-row",8-y).attr("data-row-index",y).html(8-y));
		for(var x = 0; x < 8; x++) {
			var p = new Chess.Square(x, y), s = p.toString();
			row.append($("<td class='ts square board-cell-"+y+"-"+x+" square-"+s+" column-"+x+" row-"+y+"'>").attr("data-row",s[1]).attr("data-row-index",y).attr("data-column",s[0]).attr("data-column-index",x).attr("data-square",s));
		} 
		row.append($("<th class='ts header row-header column-"+8+" row-"+y+"'>").attr("data-row",8-y).attr("data-row-index",y).html(8-y));
		this.e_board.append(row);
	}

	{
		row = $("<tr>");
		for(var x = -1; x <= 8; x++) {
			var classes = 'ts header column-header';
			if (x == -1) classes += " header-bottom-left corner";
			if (x == 8) classes += " header-bottom-right corner";
			row.append($("<th class='"+classes+"'>").attr("data-column",cols[x]).attr("data-column-index",x).html(cols[x]));
		}
		this.e_board.append(row);
	}



	$(".square", this.e_board).off("click");
	$(".square", this.e_board).on("click", function() {
		var e = $(this);
		var board = e.parent(board);
		self.renderHelpers(true);
		if( self.selected == null ) {
			if (e.children().length == 0) return;

			if ((self.selected_piece = self.chess.getPiece(new Chess.Square(e.data("square")))).clr != self.player) return self.selected_piece = null;

			e.addClass("selected");
			self.selected = e;
			self.e_board.addClass("piece-selected");
		} else {
			if ( e.is(".selected") ) {
				e.removeClass("selected");
			} else {
				$(".square.selected", self.e_board).removeClass("selected");

				if ($(".piece", e).is(".piece-clr-"+(self.player?"1":"0"))) {
					e.addClass("selected");
					self.selected = e;
					self.selected_piece = self.chess.getPiece(new Chess.Square(e.data("square")));

					self.renderHelpers();
					return;
				}

				self.move(new Chess.Square(self.selected.data("square")), new Chess.Square(e.data("square")));
			}
			self.selected = null;
			self.selected_piece = null;
			self.e_board.removeClass("piece-selected");
		}
		self.renderHelpers();
	});
	$(".square .piece", this.e_board).on("click", function() {
		$(this).parent(".square").bind("click");
	});
};
Game.prototype.render = function(render_activate) {
	if (render_activate === true) this.render_activate = true;
	else if (render_activate === false) this.render_activate = false;

	if (!!this.chess) {
		for(var y = 0; y < 8; y++) {
			for(var p,x = 0; x < 8; x++) {
				if (p = this.chess.board.getContent(x, y)) {
					var c = $("<b class='piece piece-base-"+p.char+" piece-clr-"+(p.clr?"1":"0")+" piece-"+p.toString()+"'>"+p.icon+"</b>");
					$(".square.board-cell-"+y+"-"+x, this.e_board).html(c);
				} else $(".square.board-cell-"+y+"-"+x, this.e_board).empty();
			}
		}
	} else throw "Chess not initialized";

};
Game.prototype.renderHelpers = function(clear) {
	if (this.selected == null || !(this.selected_piece instanceof Chess.Piece) || !!clear) {
		console.log("Clearing helpers", this.selected,this.selected_piece);
		$(".square",this.e_board).removeClass("helper-move-valid").removeClass("helper-move-valid-1");
	} else {
		console.log("Rendering helpers", this.selected,this.selected_piece);
		var p1_square = new Chess.Square(this.selected.data("square"));
		var vmatrix = this.selected_piece.valid_matrix(p1_square, this.chess.board.matrix);
		console.log(vmatrix, this.selected_piece, p1_square);
		for(var y = 0; y < 8; y++) {
			for(var p,x = 0; x < 8; x++) {
				if (vmatrix[y][x]) $(".square.board-cell-"+y+"-"+x, this.e_board).addClass("helper-move-valid-1");
				var p2_square = new Chess.Square(x, y);
				if (this.selected_piece.move_func(p1_square, p2_square)) {
					if ($(".square.board-cell-"+y+"-"+x+" .piece-clr-"+(this.selected_piece.clr?"1":"0"), this.e_board).length == 0)
						$(".square.board-cell-"+y+"-"+x, this.e_board).addClass("helper-move-valid");
				}
			}
		}
	}
};
Game.prototype.getHistory = function() {
	if (!!this.chess) {
		return this.chess.board.history;
	}
};
Game.prototype.getHistoryStr = function() {
	var s = "", h;
	if (!!this.chess) {
		h = this.chess.board.history;
		for(var i in h) s += h[i].toString(this.chess)+"\n";
	}
	return s;
};