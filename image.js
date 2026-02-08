let img, img1, img2


function preload()
{
  img = loadImage("assets/Image0.png")
  img1 = loadImage("assets/Image1.png")
  img2 = loadImage("assets/Image2.png")
}

function setup() 
{
  


createCanvas(displayWidth,displayHeight);
//createCanvas(1080,1920);
}

function draw() {
// put drawing code here
background(0);
image(img,200,200, img.width/3, img.height/3)
image(img1,600,200, img.width/3, img.height/3)
image(img2,1000,200, img.width/3, img.height/3)

console.log (displayWidth,displayHeight)

//fill(255,0,7);
//rect(100, 100, 300, 400);
//rect(mouseX, mouseY,200,100);

console.log(mouseX,mouseY)
}
