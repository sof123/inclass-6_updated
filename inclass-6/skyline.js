'use strict'

var c, sunLayerContext, carLayerContext;

var CANVAS_WIDTH = 800;

var carImageLoaded = false;
var CAR_IMAGE = document.createElement("img");
CAR_IMAGE.src = "http://www.clipartkid.com/images/660/red-car-bug-clip-art-vector-clip-art-online-royalty-free-TC14QB-clipart.png"
CAR_IMAGE.onload = function()
{
	carImageLoaded = true;
};



var createApp = function(canvas) { 
	c = canvas.getContext("2d");

	// Create the ground
	var floor = canvas.height/2;
	var grad = c.createLinearGradient(0,floor,0,canvas.height)
	grad.addColorStop(0, "green")
	grad.addColorStop(1, "black")
	c.fillStyle=grad
	c.fillRect(0, floor, canvas.width, canvas.height)

	// common size for windows
	var windowSpacing = 2, floorSpacing = 3
	var windowHeight = 5, windowWidth = 3

	// colors of buildings
	var blgColors = [ 'red', 'blue', 'gray', 'orange'] 

	//build a building
	var build = function() { 
		var x0 = Math.random()*canvas.width
		var blgWidth = (windowWidth+windowSpacing) * Math.floor(Math.random()*10)
		var blgHeight = Math.random()*canvas.height/2;
		
		var blgColor = blgColors[ Math.floor(Math.random()*blgColors.length)];
		c.fillStyle = blgColor;
		c.fillRect(x0, floor - blgHeight, blgWidth, blgHeight)
		
		
		for (var y = floor - floorSpacing; y > floor - blgHeight; y -= floorSpacing + windowHeight) {
			for (var x = windowSpacing; x < blgWidth - windowWidth; x += windowSpacing + windowWidth) {
				var rando = Math.random();
				if (rando < .5)
				{
					c.fillStyle = "yellow";
					c.fillRect(x0 + x, y - windowHeight, windowWidth, windowHeight);
				}
				else
				{
					c.fillStyle="black";
					c.fillRect(x0 + x, y - windowHeight, windowWidth, windowHeight);
				}
			}
		}
		
		return {
			x:x0,
			blgWidth,
			blgHeight,
			blgColor,
		};
	};
	var pointIsInBuilding = function(point, building)
	{
		return building.x < point.x && building.x + building.blgWidth > point.x && 
				point.y < floor && point.y > floor-building.blgHeight;
	};
	
	var addFloor = function(building)
	{
		c.fillStyle = building.blgColor;
		c.fillRect(building.x, floor - building.blgHeight - floorSpacing - windowHeight, building.blgWidth, floorSpacing + windowHeight); 
		building.blgHeight += (floorSpacing+windowHeight);
	};
	
	return {
		build: build,
		addFloor,
		pointIsInBuilding
	}
}


function drawSun(x, y)
{
		sunLayerContext.clearRect(0,0,sunLayerContext.canvas.width,sunLayerContext.canvas.height);
		sunLayerContext.fillStyle = "yellow";
		sunLayerContext.beginPath();
		sunLayerContext.arc(x+50,y+50,50,0,6.28);
		sunLayerContext.fill();
}



function drawCar(x,y)
{
	carLayerContext.clearRect(0,0,carLayerContext.canvas.width,carLayerContext.canvas.height);
	if (carImageLoaded)
	{
		carLayerContext.drawImage(CAR_IMAGE,x,y,200,100);
	}
}

function getPositionInCanvas(e, canvas)
{
	var rect = canvas.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	return {
		x,y
	};
}



window.onload = function() {
	var app = createApp(document.querySelector("#background"));
	var buildings = [];
	document.getElementById("build").onclick = function()
	{
		buildings.push(app.build());
	};
	document.getElementById("container").onclick = function(e)
	{
		var position = getPositionInCanvas(e,c.canvas);
		for (let building of buildings)
		{
			if (app.pointIsInBuilding(position, building))
			{
				app.addFloor(building);
				break;
			}
		}
	}
	sunLayerContext = document.getElementById("sunLayer").getContext("2d");
	carLayerContext = document.getElementById("carLayer").getContext("2d");
	var start = null;
	function step (timestamp)
	{
		if(!start)
		{
			start = timestamp;
		}
		var progress = (timestamp - start) % 2000;
		var sunX = (progress/2000)*CANVAS_WIDTH;
		var carX = (progress/2000)*CANVAS_WIDTH;
		drawSun(sunX, 10);
		drawCar(carX,300);
		window.requestAnimationFrame(step);
	}
	window.requestAnimationFrame(step);
}

