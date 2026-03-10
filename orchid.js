let audio
let timestamp

let video1
let video2
let video3
let video4
let video5

let analyzer
let fft

let inkBlobs = []

function preload() {
  audio = loadSound('./assets/orchidsound.mp3')

  video1 = createVideo('./assets/startorchid.webm')
  video2 = createVideo('./assets/orchidzoom.webm')
  video3 = createVideo ('./assets/orchidzoom2.webm')
  video4 = createVideo ('./assets/orchid4video.webm')
  video5 = createVideo ('./assets/video5orchid.webm')
}

function setup() {
  createCanvas(displayWidth, displayHeight)

  let button = createImg("./assets/playpause.png")
button.size(70, 60)
button.position(100, 100)
button.style("background-color", "rgba(255,255,255,0.6)")
button.style("border-radius", "18px")
button.mousePressed(playaudio)

  colorMode(HSB, 360, 100, 100, 100)
  noStroke()

  analyzer = new p5.Amplitude()
  analyzer.setInput(audio)
  fft = new p5.FFT()

  video1.loop()
  video1.hide()

  video2.loop()
  video2.hide()

  video3.loop()
  video3.hide()

  video4.loop()
  video4.hide()


  video5.loop()
  video5.hide()

  for (let i = 0; i < 12; i++) {
    inkBlobs.push(new InkBlob())
  }
}

function draw() {
  background(230, 20, 98)

  timestamp = audio.currentTime()
  console.log(timestamp)

  let level = analyzer.getLevel()

  if (timestamp > 0 && timestamp < 6.5) {
    playvideo1()
    blueOverlay(level)
  }

  if (timestamp > 6.5 && timestamp < 10) {
    dreamyTransition(level)
  }

  if (timestamp > 10 && timestamp < 16) {
    playvideo2()
    purpleOverlay(level)
  }

  if (timestamp > 16 && timestamp < 20) {
    dreamyTransition(level)
  }

  if (timestamp > 20 && timestamp < 26) {
    playvideo3()
    purpleOverlay(level)
  }

  if (timestamp > 26 && timestamp < 31) {
    dreamyTransition(level)
  }

  if (timestamp > 31 && timestamp < 38) {
    playvideo4()
    purpleOverlay(level)
  }
  if (timestamp > 38 && timestamp < 45) {
    dreamyTransition(level)
  }
  if (timestamp > 45 && timestamp < 51) {
    playvideo3()
    purpleOverlay(level)
  }
  if (timestamp > 51 && timestamp < 57) {
    dreamyTransition(level)
  }

  if (timestamp > 57 && timestamp < 63) {
    playvideo1()
    blueOverlay(level)
  }

  if (timestamp > 63 && timestamp < 69) {
    playvideo5()
    blueOverlay(level)
  }

  if (timestamp > 69 && timestamp < 75) {
    playvideo4()
    purpleOverlay(level)
  }

  if (timestamp > 75 && timestamp < 80) {
    dreamyTransition(level)
  }

  if (timestamp > 80 && timestamp < 86) {
    playvideo3()
    blueOverlay(level)
  }
  if (timestamp > 86 && timestamp < 90) {
    playvideo1()
    purpleOverlay(level)
  }

  if (timestamp > 90 && timestamp < 96) {
    dreamyTransition(level)
  }
  if (timestamp > 96 && timestamp < 102) {
    playvideo2()
    blueOverlay(level)
  }
  if (timestamp > 102 && timestamp < 108) {
    dreamyTransition(level)
  }

  if (timestamp > 108 && timestamp < 116) {
    playvideo5()
    purpleOverlay(level)
  }

  if (timestamp > 116 && timestamp < 122) {
    playvideo3()
    blueOverlay(level)
  }

  if (timestamp > 122 && timestamp < 125) {
    dreamyTransition(level)
  }
  if (timestamp > 125 && timestamp < 130) {
    playvideo4()
    blueOverlay(level)
  }

  if (timestamp > 130 && timestamp < 135) {
    playvideo2()
    purpleOverlay(level)
  }

  if (timestamp > 135 && timestamp < 140) {
    dreamyTransition(level)
  }

  if (timestamp > 140 && timestamp < 146) {
    playvideo5()
    blueOverlay(level)
  }

}

function playaudio() {
  if (audio.isPlaying()) {
    audio.pause()
    video1.pause()
    video2.pause()
    video3.pause()
    video4.pause()
    video5.pause()

  } else {
    audio.loop()
    video1.loop()
    video2.loop()
    video3.loop ()
    video4.loop ()
    video5.loop ()
  }
}

function playvideo1() {
  video1.size(displayWidth, displayHeight)
  let vidbuffer = video1.get()

  push()
  tint(210, 40, 100, 95)
  image(vidbuffer, 0, 0, width, height)
  pop()
}

function playvideo2() {
  video2.size(displayWidth, displayHeight)
  let vidbuffer = video2.get()

  push()
  tint(260, 35, 100, 95)
  image(vidbuffer, 0, 0, width, height)
  pop()
}
function playvideo3() {
  video3.size(displayWidth, displayHeight)
  let vidbuffer = video3.get()

  push()
  tint(260, 35, 100, 95)
  image(vidbuffer, 0, 0, width, height)
  pop()
}

function playvideo4() {
  video4.size(displayWidth, displayHeight)
  let vidbuffer = video4.get()

  push()
  tint(260, 35, 100, 95)
  image(vidbuffer, 0, 0, width, height)
  pop()
}

function playvideo5() {
  video5.size(displayWidth, displayHeight)
  let vidbuffer = video5.get()

  push()
  tint(260, 35, 100, 95)
  image(vidbuffer, 0, 0, width, height)
  pop()
}

function waveform() {
  let spectrum = fft.analyze()
  noStroke()

  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width)
    let y = map(spectrum[i], 0, 255, height, 0) - height
    fill(i, 255, 255)
    rect(x, height, width / spectrum.length, y)
  }
}

/* ---------------------- EFFECTS ---------------------- */

function blueOverlay(level) {
  push()
  blendMode(SCREEN)

  for (let blob of inkBlobs) {
    blob.update(level * 2)
    blob.displayBlue()
  }

  fill(220, 50, 100, 8)
  rect(0, 0, width, height)

  pop()
}

function purpleOverlay(level) {
  push()
  blendMode(SCREEN)

  for (let blob of inkBlobs) {
    blob.update(level * 3)
    blob.displayPurple()
  }

  fill(270, 40, 100, 10)
  rect(0, 0, width, height)

  pop()
}

function dreamyTransition(level) {
  background(240, 30, 98)

  push()
  blendMode(MULTIPLY)

  for (let y = 0; y < height; y += 25) {
    let wave = sin(frameCount * 0.03 + y * 0.01) * 40
    fill(220 + sin(frameCount * 0.02 + y * 0.01) * 20, 60, 95, 25)
    ellipse(width / 2 + wave, y, width * 0.9, 80 + level * 500)
  }

  pop()

  push()
  blendMode(SCREEN)
  for (let blob of inkBlobs) {
    blob.update(level * 4)
    blob.displayBluePurple()
  }
  pop()
}

function abstractBlueScene(level) {
  background(235, 35, 96)

  push()
  translate(width / 2, height / 2)

  for (let i = 0; i < 20; i++) {
    let angle = frameCount * 0.01 + i * 0.4
    let r = 150 + sin(frameCount * 0.03 + i) * 60 + level * 300
    let x = cos(angle) * r
    let y = sin(angle) * r

    fill(220 + i * 2, 60, 100, 18)
    ellipse(x, y, 180 + sin(frameCount * 0.04 + i) * 60)
  }

  for (let i = 0; i < 12; i++) {
    let angle = frameCount * -0.015 + i * 0.5
    let r = 220 + cos(frameCount * 0.02 + i) * 40
    let x = cos(angle) * r
    let y = sin(angle) * r

    fill(275, 35, 100, 15)
    ellipse(x, y, 120 + level * 400)
  }

  pop()

  push()
  blendMode(SCREEN)
  for (let blob of inkBlobs) {
    blob.update(level * 5)
    blob.displayBluePurple()
  }
  pop()
}

/* ---------------------- CLASS ---------------------- */

class InkBlob {
  constructor() {
    this.reset()
  }

  reset() {
    this.x = random(width)
    this.y = random(height)
    this.baseSize = random(120, 320)
    this.offset = random(1000)
    this.speedX = random(-0.5, 0.5)
    this.speedY = random(-0.3, 0.3)
  }

  update(audioBoost) {
    this.x += this.speedX + sin(frameCount * 0.01 + this.offset) * 0.4
    this.y += this.speedY + cos(frameCount * 0.01 + this.offset) * 0.4
    this.size = this.baseSize + sin(frameCount * 0.03 + this.offset) * 40 + audioBoost * 120

    if (this.x < -200 || this.x > width + 200 || this.y < -200 || this.y > height + 200) {
      this.reset()
    }
  }

  displayBlue() {
    fill(220, 70, 100, 12)
    this.drawOrganicShape()

    fill(250, 35, 100, 8)
    ellipse(this.x + 30, this.y - 20, this.size * 0.7)
  }

  displayPurple() {
    fill(270, 55, 100, 12)
    this.drawOrganicShape()

    fill(220, 65, 100, 8)
    ellipse(this.x - 20, this.y + 10, this.size * 0.75)
  }

  displayBluePurple() {
    fill(220, 70, 100, 10)
    this.drawOrganicShape()

    fill(275, 45, 100, 9)
    ellipse(this.x + 20, this.y, this.size * 0.8)
  }

  drawOrganicShape() {
    beginShape()
    for (let a = 0; a < TWO_PI; a += 0.25) {
      let noiseFactor = map(noise(cos(a) + 1, sin(a) + 1, frameCount * 0.01 + this.offset), 0, 1, 0.75, 1.25)
      let r = this.size * noiseFactor
      let px = this.x + cos(a) * r
      let py = this.y + sin(a) * r
      curveVertex(px, py)
    }
    endShape(CLOSE)
  }
}