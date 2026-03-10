let audio
let img1
let img2
let timestamp

let video1
let video2


let analyser
let fft


function preload()
{
audio = loadSound('./assets/ambient.mp3')
img1 = loadImage('./assets/Image0.png')
img2 = loadImage('./assets/Image1.png')
video1 = createVideo('./assets/vase.webm')
video2 = createVideo('./assets/tennis.webm')

}

function setup ()
{
 createCanvas(displayWidth, displayHeight)
 let button = createImg("./assets/play.jpg")
 button.size(100,60)
 button.position(100,100)
 button.mousePressed(playaudio)

 analyzer = new p5.Amplitude()
 analyzer.setInput(audio)
 fft = new p5.FFT()


}

function draw ()
{
  background(255,255,255)
  timestamp = audio.currentTime()
  console.log(timestamp)

  if (timestamp>0 && timestamp < 5)
  {
    vangogh()
  }

 if (timestamp>5 && timestamp < 10)
  {
    stocking()
  }

  if (timestamp>10 && timestamp < 33)
    {
      playvideo1()
      waveform()
    }

    if (timestamp>33 && timestamp < 45)
        {
          playvideo2()
        }
      
  
}

function playaudio()
{



if (audio.isPlaying())
{
    audio.pause()
}

else
 {
        audio.loop()
        video1.loop()
        video1.hide()
        video2.loop()
        video2.hide()
 }

}


function vangogh()
{
 
    image (img1,0 , 0, img1.width * 1.5 , img1.height * 1.5 )

}

function stocking ()
{
    image (img2, 800, 0 , img2.width, img2.height)
}


function playvideo1 ()
{
   video1.size(displayWidth, displayHeight)
   let vidbuffer = video1.get()
   image(vidbuffer, 0, 0)
}

function playvideo2 ()
{
   video2.size(displayWidth, displayHeight)
   let vidbuffer = video2.get()
   image(vidbuffer, 0, 0)
}

function waveform() {
    level = analyzer.getLevel();
    spectrum = fft.analyze();
    noStroke();
    for (i = 0; i < spectrum.length; i = i + 1) {
    x = map(i, 0, spectrum.length, 0, width);
    y = map(spectrum[i], 0, 255, height, 0) - height;
    rect(x, height, width / spectrum.length, y);
    }

    }
