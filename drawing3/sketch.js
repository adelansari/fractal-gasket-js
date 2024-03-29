// All circles in the gasket
let allCircles = [];
// Queue for circles to process for next generation
let queue = [];
// Tolerance for calculating tangency and overlap
let epsilon = 0.1;

// previousMouse
let pmx = 0,
  pmy = 0;

// big circle
let r1 = 0;

function setup() {
  const main = document.getElementById("apollo");

  const r = main.getBoundingClientRect();

  const w = r.width;
  const h = r.height;
  createCanvas(w, h);
}

function init(x, y) {
  background(22);
  stroke(255);

  const size = min(width, height);

  r1 = size / 2.75;
  let center1 = new p5.Vector(width / 2, height / 2);

  let v = new p5.Vector(x - center1.x, y - center1.y);

  let r2 = (r1 - v.mag()) / 2;
  let r3 = r1 - r2;

  let center2 = new p5.Vector(x, y).sub(center1);
  center2.setMag(center2.mag() + r2).add(center1);
  let center3 = new p5.Vector(x, y).sub(center1);
  center3.rotate(PI);
  center3.setMag(-center3.mag() + r3).add(center1);

  // Third circle also positioned relative to the first
  let c1 = new Circle(-1 / r1, center1.x, center1.y, 0);
  let c2 = new Circle(1 / r2, center2.x, center2.y, 1 - r2 / r1);
  let c3 = new Circle(1 / r3, center3.x, center3.y, 1 - r3 / r1);
  allCircles = [c1, c2, c3];
  // Initial triplet for generating next generation of circles
  queue = [[c1, c2, c3]];
}

// Check if the potential new circle is valid
function validate(c4, c1, c2, c3) {
  // Discards too small circles to avoid infinite recursion
  if (c4.radius < 3) return false;

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
  let mx = mouseX;
  let my = mouseY;

  let MM = 1;

  if (abs(pmx - mx) > MM || abs(pmy - my) > MM) {
    init(mx, my);
    pmx = mx;
    pmy = my;
  }

  // Current total circles
  let len1 = allCircles.length;

  // Generate next generation of circles
  nextGeneration();

  // New total circles
  let len2 = allCircles.length;

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

  const avg = (c1.value + c2.value + c3.value) / 3;

  const newValue = avg * 0.5;

  return [
    new Circle(k4[0], center1.a, center1.b, 1 - 1 / k4[0] / r1),
    new Circle(k4[0], center2.a, center2.b, 1 - 1 / k4[0] / r1),
    new Circle(k4[1], center3.a, center3.b, 1 - 1 / k4[1] / r1),
    new Circle(k4[1], center4.a, center4.b, 1 - 1 / k4[1] / r1),
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
