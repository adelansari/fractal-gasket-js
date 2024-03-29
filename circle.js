// Defines a circle in terms of its bend (curvature) and center point
class Circle {
  constructor(bend, x, y) {
    // Center is stored as a Complex number
    this.center = new Complex(x, y);
    this.bend = bend;
    // Radius is derived from the absolute value of the reciprocal of bend
    this.radius = abs(1 / this.bend);
  }

  show() {
    stroke(0);
    noFill();
    // Draws the circle with its center at (a, b) and diameter of radius * 2
    circle(this.center.a, this.center.b, this.radius * 2);
  }

  // Computes the distance between this circle and another circle
  dist(other) {
    return dist(this.center.a, this.center.b, other.center.a, other.center.b);
  }
}
