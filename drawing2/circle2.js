const colors = [
  ["#FFD700", "#000000"], // Gold and Black
  ["#F08080", "#8B4513"], // Light Coral and Saddle Brown
  ["#ADFF2F", "#006400"], // Green Yellow and Dark Green
  ["#FFB6C1", "#8B008B"], // Light Pink and Dark Magenta
  ["#20B2AA", "#FFFAFA"], // Light Sea Green and Snow
  ["#B0E0E6", "#4682B4"], // Powder Blue and Steel Blue
  ["#FFDEAD", "#8B4513"], // Navajo White and Saddle Brown
  ["#F0E68C", "#556B2F"], // Khaki and Dark Olive Green
  ["#EEE8AA", "#8B008B"], // Pale Goldenrod and Dark Magenta
];
colors.sort(() => Math.random() - 0.5);

// Defines a circle in terms of its bend (curvature) and center point
class Circle {
  constructor(bend, x, y, depth = 0) {
    // Center is stored as a Complex number
    this.center = new Complex(x, y);
    this.bend = bend;
    // Radius is derived from the absolute value of the reciprocal of bend
    this.radius = abs(1 / this.bend);

    // The depth is also the generation number
    this.depth = depth;
    // Select a color based on the depth
    this.col = colors[this.depth % colors.length];

    this.surprisedTimer = 0;
  }

  show() {
    const fillColor = this.col[0];
    const strokeColor = this.col[1];

    stroke(strokeColor);
    // noFill();
    fill(fillColor);
    // Draws the circle with its center at (a, b) and diameter of radius * 2
    strokeWeight(1);
    circle(this.center.a, this.center.b, this.radius * 2);

    const mouthRadius = this.radius / 5;

    // Draws the mouth, if the circle is surprised draw a full arc
    noFill();
    strokeWeight(mouthRadius / 4);
    arc(this.center.a, this.center.b + mouthRadius * 2, mouthRadius * 2, mouthRadius * 2, 0, this.surprisedTimer > 0 ? TWO_PI : PI);

    // Decrease the surprised timer by deltaTime
    if (this.surprisedTimer > 0) {
      this.surprisedTimer -= deltaTime;
    }

    const eyeRadius = this.radius / 5;
    const eyeOffset = eyeRadius * 2;
    const pupilRadius = eyeRadius / 2;

    // Define all eyes
    const eyePositions = [
      createVector(this.center.a - eyeOffset, this.center.b), // Left eye
      createVector(this.center.a + eyeOffset, this.center.b), // Right eye
      // createVector(this.center.a, this.center.b - eyeOffset), // Third eye
    ];

    // Draw all eyes
    for (const eyePosition of eyePositions) {
      // Draw the iris
      fill(strokeColor);
      noStroke();
      ellipse(eyePosition.x, eyePosition.y, eyeRadius * 2, eyeRadius * 3);

      // To get the pupil position first get the eyePosition
      const pupilPosition = eyePosition.copy();
      // Than get a vector from the pupilPosition to the mouse
      const mouseOffset = p5.Vector.sub(createVector(mouseX, mouseY), pupilPosition);
      // Limit the vector to never exceed the eye
      mouseOffset.limit(eyeRadius - pupilRadius);
      // Offset the pupilPosition by the mouseOffset
      pupilPosition.add(mouseOffset);

      // Draw the pupil
      fill(255);
      circle(pupilPosition.x, pupilPosition.y, pupilRadius * 2);
    }
  }

  mousePressed() {
    // If the mouse is over make this circle surprised
    if (dist(mouseX, mouseY, this.center.a, this.center.b) < this.radius) {
      this.surprisedTimer = 700;
      return true;
    }
    return false;
  }

  // Computes the distance between this circle and another circle
  dist(other) {
    return dist(this.center.a, this.center.b, other.center.a, other.center.b);
  }
}
