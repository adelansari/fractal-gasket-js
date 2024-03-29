function initializeCircles() {
  // Clear all existing circles
  allCircles = [];
  queue = [];
  // Tolerance for calculating tangency and overlap
  epsilon = 0.1;

  // Initialize first circle centered on canvas
  let c1 = new Circle(-1 / (width / 2), width / 2, height / 2);
  let r2 = random(100, c1.radius / 2);
  let v = p5.Vector.fromAngle(random(TWO_PI));
  v.setMag(c1.radius - r2);

  // Second circle positioned randomly within the first
  let c2 = new Circle(1 / r2, width / 2 + v.x, height / 2 + v.y);
  let r3 = v.mag();
  v.rotate(PI);
  v.setMag(c1.radius - r3);

  // Third circle also positioned relative to the first
  let c3 = new Circle(1 / r3, width / 2 + v.x, height / 2 + v.y);
  allCircles = [c1, c2, c3];
  // Initial triplet for generating next generation of circles
  queue = [[c1, c2, c3]];
}

function setup() {
  createCanvas(800, 800);
  initializeCircles();
}

function mousePressed() {
  initializeCircles();
  // Restart the draw loop
  loop();
}

function touchStarted() {
  initializeCircles();
  // Restart the draw loop
  loop();
}
// Check if the potential new circle is valid
function validate(c4, c1, c2, c3) {
  // Discards too small circles to avoid infinite recursion
  if (c4.radius < 2) return false;

  for (let other of allCircles) {
    let d = c4.dist(other);
    let radiusDiff = abs(c4.radius - other.radius);
    // Ensures new circle doesn't overlap or is too close to existing circles
    if (d < epsilon && radiusDiff < epsilon) {
      return false;
    }
  }

  // Check if all 4 circles are mutually tangential
  if (!isTangent(c4, c1)) return false;
  if (!isTangent(c4, c2)) return false;
  if (!isTangent(c4, c3)) return false;

  return true;
}

// Determine if two circles are tangent to each other
function isTangent(c1, c2) {
  let d = c1.dist(c2);
  let r1 = c1.radius;
  let r2 = c2.radius;
  // Tangency check based on distances and radii
  let a = abs(d - (r1 + r2)) < epsilon;
  let b = abs(d - abs(r2 - r1)) < epsilon;
  return a || b;
}

function nextGeneration() {
  let nextQueue = [];
  for (let triplet of queue) {
    let [c1, c2, c3] = triplet;
    // Calculate curvature for the next circle
    let k4 = descartes(c1, c2, c3);
    // Generate new circles based on Descartes' theorem
    let newCircles = complexDescartes(c1, c2, c3, k4);

    for (let newCircle of newCircles) {
      if (validate(newCircle, c1, c2, c3)) {
        allCircles.push(newCircle);
        // New triplets formed with the new circle for the next generation
        let t1 = [c1, c2, newCircle];
        let t2 = [c1, c3, newCircle];
        let t3 = [c2, c3, newCircle];
        nextQueue = nextQueue.concat([t1, t2, t3]);
      }
    }
  }
  queue = nextQueue;
}

function draw() {
  background(255);

  // Current total circles
  let len1 = allCircles.length;

  // Generate next generation of circles
  nextGeneration();

  // New total circles
  let len2 = allCircles.length;

  // Stop drawing when no new circles are added
  if (len1 == len2) {
    console.log("done");
    noLoop();
  }

  // Display all circles
  for (let c of allCircles) {
    c.show();
  }
}

// Complex calculations based on Descartes' theorem for circle generation
// https://en.wikipedia.org/wiki/Descartes%27_theorem
function complexDescartes(c1, c2, c3, k4) {
  // Curvature and center calculations for new circles
  let k1 = c1.bend;
  let k2 = c2.bend;
  let k3 = c3.bend;
  let z1 = c1.center;
  let z2 = c2.center;
  let z3 = c3.center;

  let zk1 = z1.scale(k1);
  let zk2 = z2.scale(k2);
  let zk3 = z3.scale(k3);
  let sum = zk1.add(zk2).add(zk3);

  let root = zk1.mult(zk2).add(zk2.mult(zk3)).add(zk1.mult(zk3));
  root = root.sqrt().scale(2);
  let center1 = sum.add(root).scale(1 / k4[0]);
  let center2 = sum.sub(root).scale(1 / k4[0]);
  let center3 = sum.add(root).scale(1 / k4[1]);
  let center4 = sum.sub(root).scale(1 / k4[1]);

  return [
    new Circle(k4[0], center1.a, center1.b),
    new Circle(k4[0], center2.a, center2.b),
    new Circle(k4[1], center3.a, center3.b),
    new Circle(k4[1], center4.a, center4.b),
  ];
}

// Calculate curvatures (k-values) for new circles using Descartes' theorem
function descartes(c1, c2, c3) {
  let k1 = c1.bend;
  let k2 = c2.bend;
  let k3 = c3.bend;
  // Sum and product of curvatures for Descartes' theorem
  let sum = k1 + k2 + k3;
  let product = abs(k1 * k2 + k2 * k3 + k1 * k3);
  let root = 2 * sqrt(product);
  return [sum + root, sum - root];
}
