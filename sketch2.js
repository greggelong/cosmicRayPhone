let video;
let threshold = 15;
let hitcount = 0;
let lastHitCount = 0;
let hitRate = 0;
let outputBarHeight = 40;
let brightest = 0;

// Portrait camera constraints
let constraints = {
  audio: false,
  video: {
    facingMode: { exact: "environment" },
    width: { ideal: 480 },
    height: { ideal: 720 },
  },
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(VIDEO, constraints, () => {
    console.log("Camera ready:", video.width, video.height);
  });

  video.hide();
  background(0);

  // Update hit rate once per second
  setInterval(() => {
    hitRate = hitcount - lastHitCount;
    lastHitCount = hitcount;
  }, 1000);

  textFont("monospace");
}

function draw() {
  if (!video.loadedmetadata) return;
  video.loadPixels();

  // Draw HUD bar at the top
  fill(0);
  noStroke();
  rect(0, 0, width, outputBarHeight);

  fill(255);
  textSize(16);
  textAlign(LEFT, CENTER);
  text("Hits: " + hitcount, 10, outputBarHeight / 2);
  text("Rate: " + hitRate + " /sec", 140, outputBarHeight / 2);
  text("Brightest: " + brightest.toFixed(1), 280, outputBarHeight / 2);

  // Loop through camera pixels
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
        // Map video coords to canvas coords
        let sx = map(x, 0, video.width, 0, width);
        let sy = map(y, 0, video.height, outputBarHeight, height);
        let sz = map(brightnessValue, threshold, 255, 2, 30);

        fill(255, 30); // faint rectangle, accumulates over time
        noStroke();
        rect(sx, sy, sz, sz);

        hitcount++;
      }
    }
  }
}
