function changePoint(e) {
    


}


function createPoint(e) {

  pointCount++;

  if (pointCount <= 3) {  
    polygonVertices.push({x: e.offsetX, y: e.offsetY});
    var item = document.createElement("P");
    var itemText = document.createTextNode('Point '+pointCount+' [X: '+e.offsetX+' Y: '+e.offsetY+']');
    item.appendChild(itemText);
    document.getElementById("details").appendChild(item);
    //ctx.globalCompositeOperation = "destination-over";
    ctx.shadowColor = "#000000";
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
    drawShapes();     
  }

}


function drawShapes() {

    console.log(polygonVertices);


    var expr11 = algebra.parse("( y - "+polygonVertices[2]['y']+" ) * ( "+polygonVertices[1]['x']+" - "+polygonVertices[0]['x']+" )");
    expr11 = expr11.simplify();
    var expr12 = algebra.parse("( "+polygonVertices[1]['y']+" - "+polygonVertices[0]['y']+" ) * ( x - "+polygonVertices[2]['x']+" )");
    expr12 = expr12.simplify();
    var eq1 = new Equation(expr11, expr12);    
    console.log("Equação 1: "+eq1.toString());
    var eq1 = eq1.solveFor("x");
    console.log("Equação 1 X: "+eq1.toString());

    var expr21 = algebra.parse("( y - "+polygonVertices[0]['y']+" ) * ( "+polygonVertices[2]['x']+" - "+polygonVertices[1]['x']+" )");
    expr21 = expr21.simplify();
    var expr22 = algebra.parse("( "+polygonVertices[2]['y']+" - "+polygonVertices[1]['y']+" ) * ( "+eq1+" - "+polygonVertices[0]['x']+" )");
    expr22 = expr22.simplify();
    var eq2 = new Equation(expr21, expr22);    
    console.log("Equação 2: "+eq2.toString());

    var y = eq2.solveFor("y");
    
    var x1 = algebra.parse("( "+y+" - "+polygonVertices[2]['y']+" ) * ( "+polygonVertices[1]['x']+" - "+polygonVertices[0]['x']+" )");
    x1 = x1.simplify();
    var x2 = algebra.parse("( "+polygonVertices[1]['y']+" - "+polygonVertices[0]['y']+" ) * ( x - "+polygonVertices[2]['x']+" )");
    x2 = x2.simplify();
    var eqX = new Equation(x1, x2);  
    console.log("Equação 2 X: "+eqX.toString());
    var x = eqX.solveFor("x");

    console.log("x = " + x.toString());
    console.log("y = " + y.toString());

    polygonVertices.push({x: x, y: y});

    /*ctx.shadowColor = "#000000";
    ctx.shadowBlur    = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#25857D';
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI*2, false);   
    ctx.fill();
    ctx.closePath(); */
  
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



}


function resetShape() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pointCount=0;
  document.getElementById("details").innerHTML = "";
  polygonVertices =  [];

}


function showAbout() {

  var info = document.getElementById('info');
  info.classList.toggle("hide");

}


var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
var pointCount=0;
canvas.onmouseup = createPoint;
var polygonVertices =  [];
var Equation = algebra.Equation;
