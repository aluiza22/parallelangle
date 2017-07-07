var Equation = algebra.Equation;
var updating = false;
var clickedPoint = undefined;
var hasTriangle = false;
var pointCount = 0;  
var polygonVertices = [];  
var canvas = document.getElementById('canvas');
var updateInterval = undefined;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener('click', createPoint);
canvas.addEventListener('mousedown', handleMousedown);
canvas.addEventListener('mousemove', changingPoint);
canvas.addEventListener('mouseup', stopMove);
canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
const ctx = canvas.getContext('2d');


function createPoint(e) {

  pointCount++;

  //The user selects three arbitrary points within the client area of the browser. 
  if (pointCount <= 3) {  
  
    polygonVertices.push({x: e.offsetX, y: e.offsetY});
    polygonVertices.sort(function (a, b) {
      return a.x - b.x;
    });

    //The coordinates of the selected points should be presented numerically to the user
    printDetails('Point '+pointCount+' [X: '+e.offsetX+' Y: '+e.offsetY+']');

    //the program highlights their location by drawing red circles, 11 pixels in diameter, cantered on each selected point.
    ctx.shadowColor = "#494949";
    ctx.shadowBlur    = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#97080E';
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 5.5, 0, Math.PI*2, false);   
    ctx.fill();
    ctx.closePath(); 
    
  }  

  if  (pointCount === 3) {
    hasTriangle = true;
    //Based on these three points, two additional shapes are drawn
    drawShapes();     
  }

}

//This makes the parallelogram, circle and printed information update accordingly.
function updatePoints() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("details").innerHTML = "";
  polygonVertices.splice(-1,1);

  polygonVertices.forEach(function(point, i) {
    ctx.shadowColor = "#494949";
    ctx.shadowBlur    = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#97080E';
    ctx.beginPath();
    ctx.arc(point['x'], point['y'], 5.5, 0, Math.PI*2, false);   
    ctx.fill();
    ctx.closePath();
    printDetails('Point '+i+' [X: '+point['x']+' Y: '+point['y']+']');
  });
  drawShapes();

}

function drawShapes() {

    // based on https://patch.com/new-jersey/wyckoff/find-remaining-vertex-of-a-parallelogram-given-the-other-3-geometry
    // finds the fourth point of the parallelogram based on the three selected points
    var expr11 = algebra.parse("( y - "+polygonVertices[2]['y']+" ) * ( "+polygonVertices[1]['x']+" - "+polygonVertices[0]['x']+" )");
    expr11 = expr11.simplify();
    var expr12 = algebra.parse("( "+polygonVertices[1]['y']+" - "+polygonVertices[0]['y']+" ) * ( x - "+polygonVertices[2]['x']+" )");
    expr12 = expr12.simplify();
    var eq1 = new Equation(expr11, expr12);   
    var eq1 = eq1.solveFor("x");

    var expr21 = algebra.parse("( y - "+polygonVertices[0]['y']+" ) * ( "+polygonVertices[2]['x']+" - "+polygonVertices[1]['x']+" )");
    expr21 = expr21.simplify();
    var expr22 = algebra.parse("( "+polygonVertices[2]['y']+" - "+polygonVertices[1]['y']+" ) * ( "+eq1+" - "+polygonVertices[0]['x']+" )");
    expr22 = expr22.simplify();
    var eq2 = new Equation(expr21, expr22); 
    var y = eq2.solveFor("y");
    
    var x1 = algebra.parse("( "+y+" - "+polygonVertices[2]['y']+" ) * ( "+polygonVertices[1]['x']+" - "+polygonVertices[0]['x']+" )");
    x1 = x1.simplify();
    var x2 = algebra.parse("( "+polygonVertices[1]['y']+" - "+polygonVertices[0]['y']+" ) * ( x - "+polygonVertices[2]['x']+" )");
    x2 = x2.simplify();
    var eqX = new Equation(x1, x2);  
    var x = eqX.solveFor("x");

    polygonVertices.push({x: x, y: y});
    
    //Draws a blue parallelogram, having three of its corners in the points selected by the user.
    ctx.strokeStyle = '#25857D';
    ctx.lineJoins = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;    
    ctx.beginPath();
    ctx.moveTo(polygonVertices[0]['x'], polygonVertices[0]['y']);
    ctx.lineTo(polygonVertices[1]['x'], polygonVertices[1]['y']);
    ctx.lineTo(polygonVertices[2]['x'], polygonVertices[2]['y']);
    ctx.lineTo(polygonVertices[3]['x'], polygonVertices[3]['y']);
    ctx.lineTo(polygonVertices[0]['x'], polygonVertices[0]['y']);
    ctx.stroke();

    //finds the parallelogram area
    var parallA = Math.abs((polygonVertices[0]['x'] * (polygonVertices[1]['y'] - polygonVertices[2]['y'])) + (polygonVertices[1]['x'] * (polygonVertices[2]['y'] - polygonVertices[0]['y'])) + (polygonVertices[2]['x'] * (polygonVertices[0]['y'] - polygonVertices[1]['y'])));
    
    //The area of the parallelogram should be presented numerically to the user
    printDetails('Parallelogram Area: '+parallA+'px');
    
    var centerX = ((polygonVertices[0]['x']+polygonVertices[1]['x']+polygonVertices[2]['x']+polygonVertices[3]['x'])/ 4);
    var centerY = ((polygonVertices[0]['y']+polygonVertices[1]['y']+polygonVertices[2]['y']+polygonVertices[3]['y'])/ 4);
    var circleR = Math.sqrt(parallA/Math.PI);

    //Draws the a yellow circle, with the same area and centre of mass as the parallelogram.
    ctx.strokeStyle = '#FFC52C';
    ctx.lineJoins = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2; 
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleR, 0, Math.PI*2, false);   
    ctx.stroke();
    ctx.closePath(); 

    //The area of the circle, should be presented numerically to the user
    printDetails('Circle Area: '+parallA+'px');

}

function resetCanvas() {

  //There should be feature that clears the board and allows the user to select three new points, repeating the process
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pointCount = 0;  
  polygonVertices = [];
  updating = false;
  hasTriangle = false;  
  clickedPoint = undefined;  
  document.getElementById("details").innerHTML = "";

}

function showAbout() {

  // there is an “about” feature that presents information about the program, its author and how it should be used, in your own words
  var info = document.getElementById('info');
  info.classList.toggle("hide");

}

function printDetails(detail) {

  var item = document.createElement("P");
  var itemText = document.createTextNode(detail);
  item.appendChild(itemText);
  document.getElementById("details").appendChild(item);

}

//based on https://simonsarris.com/making-html5-canvas-useful/
//The user should be free to move the points around the screen at any time. 
function handleMousedown(e) {
  clickedPoint = undefined;
  if (hasTriangle) {
    polygonVertices.forEach(function(point,i){
      var limitL = point['x'] - 5.5;
      var limitR = point['x'] + 5.5;
      var limitT = point['y'] - 5.5;
      var limitB = point['y'] + 5.5;
      if ((e.offsetX >= limitL && e.offsetX <= limitR) && (e.offsetY >= limitT && e.offsetY <= limitB)) {
        clickedPoint = i;
      }
    });
    
    if (clickedPoint != undefined) {      
      updating = true;
      updateInterval = setInterval(function() { updatePoints(); }, 60);
    }
  }
}

function changingPoint(e) {
  if (hasTriangle) {
    if (updating) {
      var overPoint = false;
      polygonVertices.forEach(function(item) {
        var limitL = item['x'] - 11;
        var limitR = item['x'] + 11;
        var limitT = item['y'] - 11;
        var limitB = item['y'] + 11;
        if ((e.offsetX >= limitL && e.offsetX <= limitR) && (e.offsetY >= limitT && e.offsetY <= limitB)) {
          overPoint = true;
        }
      });
      
      if (!overPoint) {
        polygonVertices[clickedPoint]['x'] = e.offsetX;
        polygonVertices[clickedPoint]['y'] = e.offsetY;
      }      
    }
  }
}

function stopMove() {
  if (hasTriangle && updating) {    
    clearInterval(updateInterval);
    updating = false;
  }
}
