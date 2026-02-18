let img
let audio


let amp
let rms



function preload()
{
  img = loadImage('./assets/Image0.png')
  audio = loadSound('./assets/683096__florianreichelt__woosh.mp3')
}

function setup() 
{
  

createCanvas(displayWidth,displayHeight);
//createCanvas(1080,1920);
button= createButton("Toogle Sound")
  button.position(50,38)

button2 = createImg("./assets/playpause.png")
button2.size(40,40)
button2.position(55,55)

amp = new p5.Amplitude ()
amp.setInput(audio)


}

function draw() {
// put drawing code here
background(255,255,255);
image(img,100,100, img.width/4, img.height/4)

button.mouseClicked(togglesound)
button2.mouseClicked(togglesound)

rms = amp.getlevel()
console.log(rms)





console.log (displayWidth,displayHeight)

//fill(255,0,7);
//rect(100, 100, 300, 400);
//rect(mouseX, mouseY,200,100);

console.log(mouseX,mouseY)
}


function togglesound ()

{
if (audio.isPlaying())
  {
  audio.stop()
  }
else
{
  audio.loop()
  }

}