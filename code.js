var COIN_PADDING = 2;
var COIN_WIDTH = 50;
var WIDTH_AND_PADDING = COIN_WIDTH + COIN_PADDING;
var COINS_PER_LINE = 10;
var SWAP_SPEED = 5;

var ctx;
var c;
var coinLayout;
var cursorX;
var cursorY;


window.onload = function () {
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");

	c.onmousemove = function(e){
	    cursorX = e.pageX;
	    cursorY = e.pageY;
	}

	c.onclick = function(){
		swapCoins();
		checkForBreaks();
	}

	coinLayout = generateCoinsArray();

	window.requestAnimationFrame(frame);
}


function frame(){
	ctx.clearRect(0, 0, c.width, c.height);

	drawCoins(coinLayout);
	drawSelector();


	window.requestAnimationFrame(frame);
}

function drawSelector(){
	var xCalc = Math.round(cursorX/WIDTH_AND_PADDING) * WIDTH_AND_PADDING - WIDTH_AND_PADDING;
	var yCalc = Math.round(cursorY/WIDTH_AND_PADDING) * WIDTH_AND_PADDING - WIDTH_AND_PADDING;
	ctx.beginPath();
	ctx.rect(xCalc, yCalc, COIN_WIDTH * 2, COIN_WIDTH);
	ctx.stroke();
	ctx.lineWidth=3;
}

function swapCoins(){
	var column = Math.round(cursorX/WIDTH_AND_PADDING);
	var row = Math.round(cursorY/WIDTH_AND_PADDING)-1;

	var leftCoin = coinLayout[column-1] && coinLayout[column-1][row];
	var rightCoin = coinLayout[column] && coinLayout[column][row];

	if(leftCoin && rightCoin){
		rightCoin.newX-= WIDTH_AND_PADDING;
		leftCoin.newX+= WIDTH_AND_PADDING;

		coinLayout[column][row]= leftCoin;
		coinLayout[column-1][row]= rightCoin;
	}
}

function checkForBreaks(){
	for (column = 0; column < COINS_PER_LINE; column++) {
		for (row = 0; row < COINS_PER_LINE; row++) {
			if(shouldBreak(coinLayout, column, row) && !coinLayout[column][row].broken){
				breakCoin(column, row);

			}
		}
	}
}


function generateCoinsArray(){
	var coinLayout = new Array(COINS_PER_LINE);//columns

	for (column = 0; column < COINS_PER_LINE; column++) {
		coinLayout[column] = new Array(COINS_PER_LINE);

		for (row = 0; row < COINS_PER_LINE; row++) {
			coinLayout[column][row] = getCoin(column, row);

			while (shouldBreak(coinLayout, column, row)){
				coinLayout[column][row] = getCoin(column, row);
			}
		}
	}
	return coinLayout;
}

function drawCoins(coinLayout){
	for (column = 0; column < COINS_PER_LINE; column++) {
		for (row = 0; row < COINS_PER_LINE; row++) {

			var coin = coinLayout[column][row];

			if(coin && !coin.broken){

				if(coin.x < coin.newX ){
					coin.x += SWAP_SPEED;
				}
				if(coin.x > coin.newX){
					coin.x -= SWAP_SPEED;
				}
				if(coin.y < coin.newY){
					coin.y += SWAP_SPEED;
				}
				if(coin.y > coin.newY ){
					coin.y -= SWAP_SPEED;
					//console.log('Im moving, my y:',coin.y ,'my new y:',coin.newY);
				}


				drawCoin(coin);
			}
		}
	}
}

//is coin above

function breakCoin(column, row){
	coinLayout[column][row].broken = true;

	for (row; row < COINS_PER_LINE; row++) {//these need to go up
		if(coinLayout[column][row - 1]){//if theres one above it. which there should be?
			//coinLayout[column][row].img = document.getElementById("coin5");

			// coinLayout[column][row - 1] = coinLayout[column][row];//move up
			coinLayout[column][row].newY -= WIDTH_AND_PADDING;
		}
	}


}

function getCoin(column, row){
	var x = COIN_PADDING + WIDTH_AND_PADDING * column;
	var y = COIN_PADDING + WIDTH_AND_PADDING * row;
	var coins =
	[
		{
			id: 'yellow',
			img: document.getElementById("coin1"),
			x,
			y,
			newX: x,
			newY: y,
			broken: false
		},
		{
			id: 'orange',
			img: document.getElementById("coin2"),
			x,
			y,
			newX: x,
			newY: y,
			broken: false
		},
		{
			id: 'grey',
			img: document.getElementById("coin3"),
			x,
			y,
			newX: x,
			newY: y,
			broken: false
		},
		{
			id: 'green',
			img: document.getElementById("coin4"),
			x,
			y,
			newX: x,
			newY: y,
			broken: false
		},
	];
	var rand = Math.floor((Math.random() * coins.length) + 0);
	return coins[rand];
}

function shouldBreak(coinLayout, column, row){
	var coin = coinLayout[column][row];
	if (coinLayout[column - 1] && (coinLayout[column - 1][row].id === coin.id)){//1 left
		if(coinLayout[column - 2] && (coinLayout[column - 2][row].id === coin.id)){//2 left
			return true;
		}
		if (coinLayout[column + 1] && (coinLayout[column + 1][row].id === coin.id)){//1 right
			return true;
		}
	}

	if (coinLayout[column][row - 1] && (coinLayout[column][row - 1].id === coin.id)){//1 up
		if (coinLayout[column][row - 2] && (coinLayout[column][row - 2].id === coin.id)){//2 up
			return true;
		}
		if (coinLayout[column][row + 1] && (coinLayout[column][row + 1].id === coin.id)){//1 down
			return true;
		}
	}

	if (coinLayout[column + 1] && (coinLayout[column + 1][row].id === coin.id)){//1 right
		if(coinLayout[column + 2] && (coinLayout[column + 2][row].id === coin.id)){//2 right
			return true;
		}
	}

	if (coinLayout[column][row + 1] && (coinLayout[column][row + 1].id === coin.id)){//1 down
		if (coinLayout[column][row + 2] && (coinLayout[column][row + 2].id === coin.id)){//2 down
			return true;
		}
	}
}

function drawCoin(coin){
		ctx.beginPath();
	if(coin.img){
		ctx.drawImage(coin.img, coin.x, coin.y);
	}
}
