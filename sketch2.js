let video;
let cellsz;
let threshold = 15;
let hitcount = 0;
let brightest = 0;
let outputBarHeight = 40;
let startTime;

let activeW, activeH;
let offsetX, offsetY;

// Mobile-friendly constraints: rear camera, portrait aspect
let constraints = {
  video: {
    facingMode: { exact: "environment" },
    width: { ideal: 480 },
    height: { ideal: 640 },
  },
  audio: false,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(0);
  textFont("monospace");
  textSize(26);
  stroke(255, 0, 0);

  video = createCapture(constraints, () => {
    console.log("Camera initialized.");
  });
  video.size(480, 640); // Force known size for layout
  video.hide();

  // Set the active area size and offsets (centered)
  activeW = width - 160;
  activeH = height - 160;
  offsetX = (width - activeW) / 2;
  offsetY = (height - activeH) / 2 + outputBarHeight;

  // Calculate square cell size
  cellsz = min(activeW / video.width, activeH / video.height);

  startTime = millis();
}

function draw() {
  if (!video.loadedmetadata) return;

  video.loadPixels();

  let elapsedMinutes = (millis() - startTime) / 60000;
  let hitsPerMinute = hitcount / elapsedMinutes;

  // Draw HUD
  fill(0);
  noStroke();
  rect(0, 0, width, outputBarHeight);
  fill(255);
  textAlign(LEFT, CENTER);
  text("Ht: " + hitcount, 10, outputBarHeight / 2);
  text("Rt: " + hitsPerMinute.toFixed(1) + "/m", 180, outputBarHeight / 2);
  text("Br: " + brightest.toFixed(1), 420, outputBarHeight / 2);

  // Draw blue border around active area
  noFill();
  stroke(0, 0, 255);
  strokeWeight(2);
  rect(offsetX, offsetY, video.width * cellsz, video.height * cellsz);

  // Loop through pixels
  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let i = (x + y * video.width) * 4;
      let r = video.pixels[i];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];
      let brightnessValue = (r + g + b) / 3;

      if (brightnessValue > brightest) {
        brightest = brightnessValue;
      }

      if (brightnessValue > threshold) {
        let sx = x * cellsz + offsetX;
        let sy = y * cellsz + offsetY;
        let sz = map(brightnessValue, threshold, 255, 20, 160);

        stroke(255, 0, 0);
        strokeWeight(1);
        fill(255, 255, 0, sz);
        ellipse(sx, sy, cellsz + sz, cellsz + sz);
        hitcount++;
      }
    }
  }
}
