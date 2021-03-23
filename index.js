var canvas
 var context
 var img
 var imgArr = new Array();
 var canvasW = 672;
 var canvasH = 309
 var w = 672;
 var h = 309;
 var ox = (canvasW - w) / 2
 var oy = (canvasH - h) / 2
 var th = 1;
 var bottom;
 var posData = new Array();
 var oldPos = new Array();
 var currentData = new Array();
 var targetData = posData
 var granularity = 10

 var reversed = false;
 
 for(var i=0;i<h;i+=granularity){
	 posData[i] = new Array();
	 oldPos[i] = new Array();
	 currentData[i] = new Array();
	 for(var j=0;j<w;j+=granularity){
		 posData[i][j] = {x:ox+j,y:oy+i};
		 oldPos[i][j] = {x:Math.random()*canvasW,y:Math.random()*canvasH};
		  currentData[i][j] = {x:Math.random()*canvasW,y:Math.random()*canvasH,vx:0,vy:0,ax:.16-Math.random()*.08,ay:.16-Math.random()*.08,nx:.4+Math.random()*.3,ny:.3+Math.random()*.2};
	 }
 }
 
 window.onload = init;
 window.onclick = onClick;
 var stop = false
function init(){
	canvas = $('canvas');
	context = canvas.getContext('2d');
	bottom = canvas.height - 1;
  	img = new Image();
	img.src = "1.png"
	img.onload = function () {
		var interval = setInterval(run,0);
		context.drawImage(img,0,0,w,h);
		for(var i=0;i<h;i+=granularity){
			imgArr[i] = [];
			for(var j=0;j<w;j+=granularity){
				imgArr[i][j] = context.getImageData(j,i,granularity,granularity);
			}
		}
    context.clearRect(0,0,canvas.width,canvas.height);
	}
 }
 
 function run(){
	 context.clearRect(0,0,canvas.width,canvas.height);
	 if(!reversed){
		if(th<h) th++;
	 	for(var i=0;i<h;i+=granularity){
			for(var j=0;j<w;j+=granularity){
				var target = targetData[i][j];
				var current = currentData[i][j];
				if(i<th){
					var xdiff = target.x - current.x;
					var ydiff = target.y - current.y;
					if(Math.abs(xdiff)<0.5) {
						current.x = target.x;
					} else {
						current.x+= (target.x - current.x)*current.ax;
					}
					if(Math.abs(ydiff)<0.5) {
						current.y = target.y;
					} else {
						current.y+= (target.y - current.y)*current.ay;
					}
				}
				context.putImageData(imgArr[i][j],current.x,current.y);
			 }
		 }
	 } else {
	 	for(var i=0;i<h;i+=granularity){
			for(var j=0;j<w;j+=granularity){
				var current = currentData[i][j];
				current.x+=current.vx;
				current.y+=current.vy;
				
				if(current.y>=bottom){
					current.y = bottom;
					current.vy = -current.ny*current.vy;
					if(Math.abs(current.vy)<=1) {
						current.vy = 0;
					}
					current.vx*=current.nx;
					if(Math.abs(current.vx)<=1) current.vx = 0;
				} else {
					current.vy+=1;
				}
				context.putImageData(imgArr[i][j],current.x,current.y);
			}
		}
	 }
 }
 
 function onClick(){
	 reversed = !reversed;
	 if(reversed){
		 for(var i=0;i<h;i+=granularity){
			for(var j=0;j<w;j+=granularity){
				var current = currentData[i][j];
				current.vx = (Math.random()-Math.random())*3;
				current.vy = -Math.random()*10;
			}
		 }
	 } else {
		 th=1;
		 targetData = posData
	 }
 }
 
 
 function $(id){
	 return document.getElementById(id);
 }