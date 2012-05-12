/**** Position information ****/

var CARD_SIZE = { width: 71, height: 96 };
var CONDENSE_COUNT = 6; //How many cards are shown as one in a deck
var CARD_PADDING = 18;
var OVERLAY_MARGIN = 2;
var HORIZONTAL = 'h';
var VERTICAL = 'v';
var LEFT = 'left', RIGHT = 'right', TOP = 'top', BOTTOM = 'bottom';

//Timing
var ANIMATION_SPEED = 500;

var zIndexCounter = 1;
var CARDBACK = { x: 0, y: -4 * CARD_SIZE.height };
var HCARDBACK = { x: -8 * CARD_SIZE.height, y: -5 * CARD_SIZE.height};

jQuery.fn.moveCard= function(top,left,callback, speed) {
	var props = {};
	props['top'] = top;
	props['left'] = left;
	props['queue'] = false;
	this.animate(props, speed || ANIMATION_SPEED, callback);
	return this;
};

jQuery.fn.setBackground = function(x,y) {
	var props = {};
	props['background-position'] = x + ' ' + y;
	this.css(props);
	return this;
};

Card.prototype.rotate = function(angle) {
	$(this.guiCard)
	.css('-webkit-transform', 'rotate(' + angle + 'deg)')
	.css('-moz-transform', 'rotate(' + angle + 'deg)')
	.css('-ms-transform', 'rotate(' + angle + 'deg)')
	.css('transform', 'rotate(' + angle + 'deg)')
	.css('-o-transform', 'rotate(' + angle + 'deg)');
}

Card.prototype.showCard = function(position) {
    var offsets = { "c": 0, "d": 1, "h": 2, "s": 3 };
	var xpos, ypos;
	if (!position) {
		position = BOTTOM;
	}
	var h = $(this.guiCard).height(), w = $(this.guiCard).width();
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
			$(this.guiCard).height(w).width(h);
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
			$(this.guiCard).height(w).width(h);
		}
		this.rotate(0);
	}
    $(this.guiCard).setBackground(xpos + 'px', ypos + 'px');
};

Card.prototype.moveToFront = function() {
	this.guiCard.style.zIndex = zIndexCounter++;
};

Card.prototype.hideCard = function(position) {
	if (!position) {
		position = BOTTOM;
	}
	var h = $(this.guiCard).height(), w = $(this.guiCard).width();
    if (position == TOP || position == BOTTOM) {
		$(this.guiCard).setBackground(CARDBACK.x + 'px', CARDBACK.y + 'px');
		if (w>h) {
			$(this.guiCard).height(w).width(h);
		}
	} else {
		$(this.guiCard).setBackground(HCARDBACK.x + 'px', HCARDBACK.y + 'px');
		if (h>w) {
			$(this.guiCard).height(w).width(h);
		}
	}
	this.rotate(0);
};

function showCards(cards, position, speed) {
    setTimeout(function () {
        for (var i = 0; i < cards.length; i++) {
            cards[i].showCard(position);
        }
    }, speed || (ANIMATION_SPEED / 2));
}

function hideCards(cards, position, speed) {
    setTimeout(function () {
        for (var i = 0; i < cards.length; i++) {
            cards[i].hideCard(position);
        }
    }, speed || (ANIMATION_SPEED / 2));
}

