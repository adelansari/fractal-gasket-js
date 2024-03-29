let size = 8;
let images = [];

function preload() {
  for (let i = 0; i < size; i++) {
    images[i] = loadImage("imgs/apollonian-0" + (i + 1) + ".png");
  }
}

let springRate = 0.25;
let dampingFactor = 0.5;
let gravity = 0.0;
let mouseTouchRadius = 65;
let mouseSpringRate = 0.05;
let maxBalls = 120; //Snowflakes as balls :)

let clts = {
  title: "Click Apollonian gaskets",
  num: 50,
  grav: 0.0,
  damp: 0.5,
  spr: 0.25,
  show: false,
};

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // create gui (dat.gui)
  let gui = new dat.GUI({
    width: 330,
  });
  gui.close();
  gui.add(clts, "title").name("Interaction:");
  gui.add(clts, "num", 0, 50).name("Num. Circles").step(1);
  gui.add(clts, "grav", -0.1, 0.1).name("Gravity").step(0.001).listen();
  gui.add(clts, "damp", 0.001, 0.7).name("Damping").step(0.001).listen();
  gui.add(clts, "spr", 0.01, 0.4).name("Spring").step(0.001).listen();

  for (let i = 0; i < clts.num; i++) {
    pushRandom();
  }

  console.log(images.length);
}

function draw() {
  background("#333");
  cursor(HAND);
  for (let i = 0; i < ballArray.length; i++) {
    for (let j = 0; j < i; j++) {
      let distance = dist(ballArray[i].x, ballArray[i].y, ballArray[j].x, ballArray[j].y);
      let touchDist = ballArray[i].diameter / 2 + ballArray[j].diameter / 2;
      if (distance < touchDist) {
        let dx = ballArray[i].x - ballArray[j].x;
        let dy = ballArray[i].y - ballArray[j].y;
        //let force = springRate * (touchDist - distance);
        let force = clts.spr * (touchDist - distance);
        dx /= distance;
        dy /= distance;
        let tfx = dx * force;
        let tfy = dy * force;
        ballArray[i].fsumx += tfx;
        ballArray[i].fsumy += tfy;
        ballArray[j].fsumx -= tfx;
        ballArray[j].fsumy -= tfy;
        let dspeedx = ballArray[i].speedx - ballArray[j].speedx;
        let dspeedy = ballArray[i].speedy - ballArray[j].speedy;
        let dotProduct = dspeedx * dx + dspeedy * dy;
        //let damping = dotProduct * dampingFactor;
        let damping = dotProduct * clts.damp;
        let sfx = dx * damping;
        let sfy = dy * damping;
        ballArray[i].fsumx -= sfx;
        ballArray[i].fsumy -= sfy;
        ballArray[j].fsumx += sfx;
        ballArray[j].fsumy += sfy;
      }
    }
  }
  for (let ball of ballArray) {
    ball.display();
    ball.move();
  }

  // Adjust the amount of balls on screen according to the slider value
  let maxBalls = clts.num;
  let difference = ballArray.length - maxBalls;
  if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      pushRandom(); // Add balls if there are less balls than the slider value
    }
  } else if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      ballArray.pop(); // Remove balls if there are more balls than the slider value
    }
  }
}

// Make a new ball
function pushRandom() {
  let bll = new ball(); // Create a new ball
  ballArray.push(bll); // Add the new balls to the array
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class ball {
  constructor() {
    this.x = random(windowWidth);
    this.y = random(windowHeight);
    this.diameter = random(60, 120);
    this.resize = (1 / 2) * map(this.diameter, 6, 28, 0.055, 0.135);
    let speed = 1;
    let dir = random(0, 2 * PI);
    this.speedx = speed * cos(dir);
    this.speedy = speed * sin(dir);
    this.fsumx = 0;
    this.fsumy = 0;
    this.randomImage = this.randomInteger(0, size - 1);
    this.rotAngle = random(-50, 50);
  }

  move() {
    if (mouseIsPressed) {
      let distance = dist(this.x, this.y, mouseX, mouseY);
      let touchDist = mouseTouchRadius;
      if (distance < touchDist) {
        let dx = this.x - mouseX;
        let dy = this.y - mouseY;
        let force = mouseSpringRate * (touchDist - distance);
        dx /= distance;
        dy /= distance;
        let tfx = dx * force;
        let tfy = dy * force;
        this.fsumx += tfx;
        this.fsumy += tfy;
      }
    }
    //this.diameter = 450 * this.diameter;
    if (this.x < this.diameter / 2) {
      this.fsumx -= clts.spr * (this.x - this.diameter / 2);
    }
    if (this.y < this.diameter / 2) {
      this.fsumy -= clts.spr * (this.y - this.diameter / 2);
    }
    if (this.x > windowWidth - this.diameter / 2) {
      this.fsumx -= clts.spr * (this.x - (windowWidth - this.diameter / 2));
    }
    if (this.y > windowHeight - this.diameter / 2) {
      this.fsumy -= clts.spr * (this.y - (windowHeight - this.diameter / 2));
      this.fsumy -= this.speedy * 0.01;
    }
    this.speedx += this.fsumx;
    this.speedy += this.fsumy;
    this.fsumx = 0;
    this.fsumy = clts.grav;
    this.x += this.speedx;
    this.y += this.speedy;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotAngle));
    scale(this.resize, this.resize);
    imageMode(CENTER);
    image(images[this.randomImage], 0, 0);
    pop();

    noFill();
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
