let audio
let timestamp = 0

let video1
let video2
let video3
let video4
let video5

let analyzer
let fft
let playButton

let inkBlobs = []

// langsameres Timing für deine Stimme
let captions = [
  { start: 8, end: 10.5, text: "Hello everyone, and welcome." },

  { start: 10.5, end: 15, text: "Today I want to show you a very special orchid" },
  { start: 15, end: 20, text: "called Vanda coerulea, also known as the blue orchid." },

  { start: 20, end: 24.5, text: "What makes this flower so interesting is its color." },
  { start: 24.5, end: 28.5, text: "The deep blue tone is very rare in nature," },
  { start: 28.5, end: 32.5, text: "which is why this orchid attracted so much attention" },
  { start: 32.5, end: 35.5, text: "from scientists and collectors." },

  { start: 35.5, end: 40, text: "The plant was first scientifically described in 1847" },
  { start: 40, end: 43.5, text: "by the botanist John Lindley." },
  { start: 43.5, end: 48.5, text: "It originally grows in the Khasi Hills in northeast India." },

  { start: 48.5, end: 51.5, text: "When it was later introduced to Europe," },
  { start: 51.5, end: 56.5, text: "many botanists and plant collectors became fascinated by it." },

  { start: 56.5, end: 62, text: "During the 19th century, orchids became extremely popular." },
  { start: 62, end: 66.5, text: "This period was sometimes called 'orchid mania'," },
  { start: 66.5, end: 72, text: "because many people wanted rare and unusual plants for their collections." },

  { start: 72, end: 75.5, text: "Since blue orchids are so uncommon," },
  { start: 75.5, end: 79, text: "Vanda coerulea became especially valuable." },

  { start: 79, end: 85, text: "In parts of India, the orchid was not only admired for its beauty" },
  { start: 85, end: 88, text: "but also used in traditional medicine." },

  { start: 88, end: 92, text: "What makes this flower interesting is that it shows" },
  { start: 92, end: 98.5, text: "how people are often drawn to rare and beautiful things in nature." },
  { start: 98.5, end: 101.5, text: "Even a single flower can tell a much bigger story" },
  { start: 101.5, end: 105, text: "about science, exploration, and collecting." }
]

function preload() {
  audio = loadSound('./assets/orchidsound.mp3')

  video1 = createVideo('./assets/startorchid.webm')
  video2 = createVideo('./assets/orchidzoom.webm')
  video3 = createVideo('./assets/orchidzoom2.webm')
  video4 = createVideo('./assets/orchid4video.webm')
  video5 = createVideo('./assets/video5orchid.webm')
}

function setup() {
  createCanvas(windowWidth, windowHeight)

  playButton = createImg("./assets/playpause.png")
  updateButtonLayout()
  playButton.style("background-color", "rgba(255,255,255,0.6)")
  playButton.style("border-radius", "18px")
  playButton.style("padding", "6px")
  playButton.style("z-index", "10")
  playButton.mousePressed(playaudio)

  colorMode(HSB, 360, 100, 100, 100)
  rectMode(CENTER)
  noStroke()

  analyzer = new p5.Amplitude()
  analyzer.setInput(audio)
  fft = new p5.FFT()
  fft.setInput(audio)

  setupVideo(video1)
  setupVideo(video2)
  setupVideo(video3)
  setupVideo(video4)
  setupVideo(video5)

  for (let i = 0; i < 12; i++) {
    inkBlobs.push(new InkBlob())
  }
}

function setupVideo(vid) {
  vid.volume(0)
  vid.loop()
  vid.hide()
}

function draw() {
  background(230, 20, 98)

  timestamp = audio.currentTime()
  let duration = audio.duration() || 0
  let level = analyzer.getLevel()

  if (timestamp > 0 && timestamp < 5) {
    playvideo1()
    blueOverlay(level)
  }

  if (timestamp > 5 && timestamp < 8) {
    dreamyTransition(level)
  }

  if (timestamp > 8 && timestamp < 15) {
    playvideo2()
    purpleOverlay(level)
  }

  if (timestamp > 15 && timestamp < 23) {
    playvideo5()
    blueOverlay(level)
  }

  if (timestamp > 15 && timestamp < 20) {
    playvideo3()
    purpleOverlay(level)
  }

  if (timestamp > 20 && timestamp < 25) {
    dreamyTransition(level)
  }

  if (timestamp > 25 && timestamp < 31) {
    playvideo4()
    purpleOverlay(level)
  }

  if (timestamp > 31 && timestamp < 37) {
    dreamyTransition(level)
  }

  if (timestamp > 37 && timestamp < 43) {
    playvideo3()
    purpleOverlay(level)
  }

  if (timestamp > 43 && timestamp < 57) {
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

  if (timestamp > 116 && timestamp < max(duration - 4, 116)) {
    playvideo3()
    blueOverlay(level)
  }

  if (duration > 0 && timestamp >= duration - 4 && timestamp <= duration) {
    showCredits()
  }

  subtitles()
}

function playaudio() {
  if (audio.isPlaying()) {
    audio.pause()
    pauseAllVideos()
  } else {
    audio.play()
    resumeAllVideos()
  }
}

function pauseAllVideos() {
  video1.pause()
  video2.pause()
  video3.pause()
  video4.pause()
  video5.pause()
}

function resumeAllVideos() {
  video1.loop()
  video2.loop()
  video3.loop()
  video4.loop()
  video5.loop()
}

function playvideo1() {
  drawVideo(video1, 210)
}

function playvideo2() {
  drawVideo(video2, 260)
}

function playvideo3() {
  drawVideo(video3, 260)
}

function playvideo4() {
  drawVideo(video4, 260)
}

function playvideo5() {
  drawVideo(video5, 260)
}

function drawVideo(video, hueValue) {
  video.size(width, height)
  let vidbuffer = video.get()

  push()
  tint(hueValue, 35, 100, 95)
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

  fill(220, 40, 100, 10)
  rect(width / 2, height / 2, width, height)

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
  rect(width / 2, height / 2, width, height)

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

function subtitles() {
  let activeCaption = ""

  for (let c of captions) {
    if (timestamp >= c.start && timestamp <= c.end) {
      activeCaption = c.text
      break
    }
  }

  if (activeCaption !== "") {
    let boxW = min(width * 0.82, 900)
    let boxH = max(80, height * 0.12)
    let yPos = height * 0.72
    let textPadding = boxW * 0.08
    let fontSize = constrain(width * 0.022, 18, 30)

    push()
    rectMode(CENTER)
    textAlign(CENTER, CENTER)
    textSize(fontSize)
    textLeading(fontSize * 1.3)

    fill(0, 0, 0, 72)
    noStroke()
    rect(width / 2, yPos, boxW, boxH, 18)

    fill(0, 0, 100)
    text(activeCaption, width / 2, yPos, boxW - textPadding, boxH - 20)
    pop()
  }
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

function showCredits() {
  background(245, 20, 15)

  let duration = audio.duration() || 0
  let alpha = map(timestamp, duration - 4, duration, 0, 100)
  alpha = constrain(alpha, 0, 100)

  let titleSize = constrain(width * 0.04, 28, 42)
  let bodySize = constrain(width * 0.022, 16, 24)
  let smallSize = constrain(width * 0.016, 12, 16)

  push()
  textAlign(CENTER, CENTER)
  fill(0, 0, 100, alpha)

  textSize(titleSize)
  text("Credits", width / 2, height * 0.32)

  textSize(bodySize)
  text("Flower reference: Vanda coerulea bloom", width / 2, height * 0.44)
  text("Source: Smithsonian 3D", width / 2, height * 0.49)

  textSize(smallSize)
  text("3d.si.edu/object/3d/vanda-coerulea-bloom", width / 2, height * 0.56, width * 0.8)

  textSize(bodySize)
  text("Sound source:", width / 2, height * 0.66)

  textSize(smallSize + 2)
  text('"April Showers: Sweet Lo-Fi Piano Vibes"', width / 2, height * 0.73, width * 0.8)
  text("by kjartan_abel on freesound.org", width / 2, height * 0.79)

  pop()
}

/* ---------------------- RESPONSIVE ---------------------- */

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  updateButtonLayout()
}

function updateButtonLayout() {
  let btnW = constrain(windowWidth * 0.06, 52, 72)
  let btnH = btnW * 0.86
  let margin = constrain(windowWidth * 0.025, 16, 32)

  if (playButton) {
    playButton.size(btnW, btnH)
    playButton.position(margin, margin)
  }
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
    for (let a = 0; a < TWO_PI; a += 0.3) {
      let r = this.size + sin(a * 3 + frameCount * 0.02 + this.offset) * 25
      let px = this.x + cos(a) * r
      let py = this.y + sin(a) * r
      curveVertex(px, py)
    }
    endShape(CLOSE)
  }
}