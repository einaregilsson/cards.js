
var cards = (function() {
	//Constants:
	var CARD_SIZE = {width:71,height:96};
	var CONDENSE_COUNT = 6; //How many cards are shown as one in a deck
	var CARD_PADDING = 18;
	var OVERLAY_MARGIN = 2;
	var HORIZONTAL = 'h';
	var VERTICAL = 'v';
	var LEFT = 'left', RIGHT = 'right', TOP = 'top', BOTTOM = 'bottom';
	//Timing
	var ANIMATION_SPEED = 500;
	var CARDBACK = { x: 0, y: -4 * CARD_SIZE.height };
	var HCARDBACK = { x: -8 * CARD_SIZE.height, y: -5 * CARD_SIZE.height};

	var zIndexCounter = 1;
	
	var all = []; //All the cards created.
	
	function init(options) {
		options = options || {};
		all = [];
		var start = options.acesHigh ? 2 : 1;
		var end = start + 12;
		if (!options.table) {
			alert('You must set the table id');
		}
		var table = $(options.table);
		
		for (var i = start; i <= end; i++) {
			all.push(new Card('h', i, table));
			all.push(new Card('s', i, table));
			all.push(new Card('d', i, table));
			all.push(new Card('c', i, table));
		}
		if (options.blackJoker) {
			all.push(new Card('bj', 0, table));
		}
		if (options.redJoker) {
			all.push(new Card('rj', 0, table));
		}
		shuffle(all);
	}

    function shuffle(deck) {
        //Fisher yates shuffle
        var i = deck.length;
        if (i == 0) return;
        while (--i) {
            var j = Math.floor(Math.random() * (i + 1));
            var tempi = deck[i];
            var tempj = deck[j];
            deck[i] = tempj;
            deck[j] = tempi;
        }
    }
	
	function Card(suit, rank, table) {
		this.init(suit, rank, table);
	}
	
	Card.prototype = {
		init: function (suit, rank, table) {
			this.shortName = suit + rank;
			this.suit = suit;
			this.rank = rank;
			this.name = suit.toUpperCase()+rank;
			this.faceUp = false;
			this.el = $('<div/>').css({
				width:'71px',
				height:'96px',
				"background-image":'url(img/cards.png)',
				position:'absolute',
				cursor:'pointer'	
			}).addClass('card').appendTo($(table));
			this.showCard();
			this.moveToFront();
		},

		toString: function () {
			return this.name;
		},

		moveTo : function(x, y, speed, callback) {
			var props = {top:y-(CARD_SIZE.height/2),left:x-(CARD_SIZE.width/2)};
			$(this.el).animate(props, speed || ANIMATION_SPEED, callback);
		},
		
		rotate : function(angle) {
			$(this.el)
				.css('-webkit-transform', 'rotate(' + angle + 'deg)')
				.css('-moz-transform', 'rotate(' + angle + 'deg)')
				.css('-ms-transform', 'rotate(' + angle + 'deg)')
				.css('transform', 'rotate(' + angle + 'deg)')
				.css('-o-transform', 'rotate(' + angle + 'deg)');
		},
		
		showCard : function(position) {
			var offsets = { "c": 0, "d": 1, "h": 2, "s": 3 };
			var xpos, ypos;
			if (!position) {
				position = BOTTOM;
			}
			var h = $(this.el).height(), w = $(this.el).width();
			if (position == TOP || position == BOTTOM) {
				var rank = this.rank;
				if (rank == 1) {
					rank = 14; //Aces low must work as well.
				}
				xpos = (-rank + 2) * CARD_SIZE.width;
				ypos = -offsets[this.suit] * CARD_SIZE.height;
				if (position == TOP && this.rank > 10) {
					xpos -= 4*CARD_SIZE.width;
				}
				//Special case for jokers...
				if (this.rank == 0) {
					ypos = -4*CARD_SIZE.height;
					var extra = position == TOP ? 2 : 0;
					if (this.suit == 'rj') {
						xpos = (-2-extra)*CARD_SIZE.width;
					} else if (this.suit == 'bj') {
						xpos = (-3-extra)*CARD_SIZE.width;
					}
				}
				if (w>h) {
					$(this.el).height(w).width(h);
				}
				this.rotate(0);
			} else {
				ypos = -5*CARD_SIZE.height; //base pos
				var rank = this.rank;
				if (rank == 1) {
					rank = 14;
				}
				//Special case for jokers...
				if (this.rank == 0) {
					xpos = -8*CARD_SIZE.height;
					var extra = position == RIGHT ? 0 : 2;
					if (this.suit == 'rj') {
						ypos -= (2+extra)*CARD_SIZE.width;
					} else if (this.suit == 'bj') {
						ypos -= (3+extra)*CARD_SIZE.width;
					}
				} else if (this.rank <= 10) {
					ypos -= (this.rank-2)*CARD_SIZE.width;
					xpos = -offsets[this.suit] * CARD_SIZE.height;
				} else {
					xpos = -4*CARD_SIZE.height -offsets[this.suit] * CARD_SIZE.height;
					if (position == LEFT) {
						ypos -= (this.rank-7)*CARD_SIZE.width;
					} else { //RIGHT
						ypos -= (this.rank-11)*CARD_SIZE.width;
					}
				}
				
				if (h>w) {
					$(this.el).height(w).width(h);
				}
				this.rotate(0);
			}
			$(this.el).css('background-position', xpos + 'px ' + ypos + 'px');
		},

		hideCard : function(position) {
			if (!position) {
				position = BOTTOM;
			}
			var h = $(this.el).height(), w = $(this.el).width();
			if (position == TOP || position == BOTTOM) {
				$(this.el).css('background-position', CARDBACK.x + 'px ' + CARDBACK.y + 'px');
				if (w>h) {
					$(this.el).height(w).width(h);
				}
			} else {
				$(this.el).css('background-position', HCARDBACK.x + 'px ' + HCARDBACK.y + 'px');
				if (h>w) {
					$(this.el).height(w).width(h);
				}
			}
			this.rotate(0);
		},
		
		moveToFront : function() {
			$(this.el).css('z-index', zIndexCounter++);
		}		
	};

	return {
		init : init,
		all : all,
		SIZE : CARD_SIZE,
		Card : Card,
		shuffle: shuffle
	};
})();

