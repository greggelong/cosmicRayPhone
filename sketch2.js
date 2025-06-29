let video;
let cellsz;
let threshold = 55;
let hitcount = 0;
let brightest = 0;
let gotVideoSize = false;
let outputBarHeight = 100;
let startTime;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(0);

  // Request portrait aspect ratio for mobile
  let constraints = {
    video: {
      facingMode: { exact: "environment" },
      width: { ideal: 480 },
      height: { ideal: 720 },
    },
    audio: false,
  };
  video = createCapture(constraints);
  video.hide();

  textFont("monospace");
  textSize(46);
  stroke(255, 0, 0);
  startTime = millis();
}

function draw() {
  if (!video.loadedmetadata) return;

  // Calculate square cell size once
  if (!gotVideoSize) {
    cellsz = min(
      width / video.width,
      (height - outputBarHeight) / video.height
    );
    console.log("Video size:", video.width, video.height);
    console.log("Cell size:", cellsz);
    gotVideoSize = true;
  }

  video.loadPixels();

  // Calculate hits per minute
  let elapsedMinutes = (millis() - startTime) / 60000;
  let hitsPerMinute = hitcount / elapsedMinutes;

  // Draw HUD bar
  fill(0);
  noStroke();
  rect(0, 0, width, outputBarHeight);
  fill(255);
  textAlign(LEFT, CENTER);
  text("Hits: " + hitcount, 10, outputBarHeight / 2);
  text("Rate: " + hitsPerMinute.toFixed(1) + " /min", 140, outputBarHeight / 2);
  text("Brightest: " + brightest.toFixed(1), 300, outputBarHeight / 2);

  // Loop through video pixels
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
        let sx = x * cellsz;
        let sy = y * cellsz + outputBarHeight;
        let sz = map(brightnessValue, threshold, 255, cellsz, cellsz * 4); // circle size scales up
        fill(255, 255, 0, 10); // soft yellow, low alpha
        noStroke();
        ellipse(sx, sy, sz, sz);
        hitcount++;
      }
    }
  }
}
