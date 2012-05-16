
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
	
	var table = {};
	var all = []; //All the cards created.
	
	function init(options) {
		options = options || {};
		var start = options.acesHigh ? 2 : 1;
		var end = start + 12;
		if (!options.table) {
			alert('You must set the table id');
		}
		table.el = $(options.table);
		if ($(table.el).css('position') == 'static') {
			$(table.el).css('position', 'relative');
		}
		for (var i = start; i <= end; i++) {
			all.push(new Card('h', i, table.el));
			all.push(new Card('s', i, table.el));
			all.push(new Card('d', i, table.el));
			all.push(new Card('c', i, table.el));
		}
		if (options.blackJoker) {
			all.push(new Card('bj', 0, table.el));
		}
		if (options.redJoker) {
			all.push(new Card('rj', 0, table.el));
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
	
	function Container() {
	
	}
	
	Container.prototype = new Array();
	Container.prototype.extend = function(obj) {
		for (var prop in obj) {
			this[prop] = obj[prop];
		}
	}
	Container.prototype.extend({
		addCards : function(cards) {
			for (var i = 0; i < cards.length;i++) {
				this.push(cards[i]);
				cards[i].container = this;
			}
		},

		init : function(options) {
			options = options || {};
			this.x = options.x || $(table.el).width()/2;
			this.y = options.y || $(table.el).height()/2;
			this.faceUp = options.faceUp;
		},

		render : function(options) {
			options = options || {};
			var speed = options.speed || ANIMATION_SPEED;
			this.calcPosition(options);
			for (var i=0;i<this.length;i++) {
				var card = this[i];
				zIndexCounter++;
				card.moveToFront();
				var top = parseInt($(card.el).css('top'));
				var left = parseInt($(card.el).css('left'));
				if (top != card.targetTop || left != card.targetLeft) {
					var props = {top:card.targetTop, left:card.targetLeft};
					if (options.immediate) {
						$(card.el).css(props);
					} else {
						$(card.el).animate(props, speed);
					}
				}
			}
			var me = this;
			var flip = function(){
				for (var i=0;i<me.length;i++) {
					if (me.faceUp) {
						me[i].showCard();
					} else {
						me[i].hideCard();
					}
				}
			}
			if (options.immediate) {
				flip();
			} else {
				setTimeout(flip, speed /2);
			}
			
			if (options.callback) {
				setTimeout(options.callback, speed);
			}
		},
		
		topCard : function() {
			return this[this.length-1];
		},
		
		toString: function() {
			return 'Container';
		}
	});
	
	function Deck(options) {
		this.init(options);
	}
	
	Deck.prototype = new Container();
	Deck.prototype.extend({
		calcPosition : function(options) {
			options = options || {};
			var left = Math.round(this.x-CARD_SIZE.width/2, 0);
			var top = Math.round(this.y-CARD_SIZE.height/2, 0);
			for (var i=0;i<this.length;i++) {
				if (i > 0 && i % CONDENSE_COUNT == 0) {
					top-=1;
					left-=1;
				}
				this[i].targetTop = top;
				this[i].targetLeft = left;
			}
		},
		
		toString : function() {
			return 'Deck';
		},
		
		deal : function(count, hands) {
			if (!this.dealCounter) {
				this.dealCounter = count * hands.length;
			}
		}
	});

	function Hand(options) {
		this.init(options);
	}
	Hand.prototype = new Container();
	Hand.prototype.extend({
		calcPosition : function(options) {
			options = options || {};
			var width = CARD_SIZE.width + (this.length-1)*CARD_PADDING;
			var left = Math.round(this.x - width/2);
			var top = Math.round(this.y-CARD_SIZE.height/2, 0);
			for (var i=0;i<this.length;i++) {
				this[i].targetTop = top;
				this[i].targetLeft = left+i*CARD_PADDING;
			}
		},
		
		toString : function() {
			return 'Hand';
		}
	});
	
	function Pile(options) {
		this.init(options);
	}
	
	Pile.prototype = new Container();
	Pile.prototype.extend({
		calcPosition : function(options) {
			options = options || {};
		},
		
		toString : function() {
			return 'Pile';
		},
		
		deal : function(count, hands) {
			if (!this.dealCounter) {
				this.dealCounter = count * hands.length;
			}
		}
	});
	

	return {
		init : init,
		all : all,
		SIZE : CARD_SIZE,
		Card : Card,
		Container : Container,
		Deck : Deck,
		Hand : Hand,
		Pile : Pile,
		shuffle: shuffle
	};
})();

