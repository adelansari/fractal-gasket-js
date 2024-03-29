# Fractal Gasket JS

This project is about creating different forms of Apollonian Gasket using the Descartes Circle Theorem and complex numbers in JavaScript. The Apollonian Gasket is a fractal generated from three circles mutually tangent to each other. The Descartes Circle Theorem is used to calculate the curvature of the next circles in the fractal.

The project will be divided into different drawing folders, each having its own unique implementation of the Apollonian Gasket.

![Apollonian Gasket Demo](assets/demo.png)

## File Structure
```
complex.js
drawing1/
    circle.js
    sketch.js
    index.html
drawing2/
drawing3/
drawing4/
index.html
README.md
style.css
```

## Getting Started

To get started with this project:

1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser to view the visualization.
3. Explore the code to understand how the fractal is generated.


## Files

- `circle.js` : This files define a Circle class. Each `circle` is defined by its bend (curvature), center point, and depth. The center point is stored as a `Complex` number. The radius of the circle is derived from the absolute value of the reciprocal of the bend. The depth is also the generation number, and it's used to select a color for the circle.
- `complex.js`: This file likely contains the implementation of the `Complex` class, which is used to represent complex numbers. Complex numbers are used in the calculations for generating new circles based on Descartes' theorem.
- `sketch.js`: This file contain the main logic for generating the Apollonian Gasket. They maintain a list of all circles in the gasket and a queue of circles to process for the next generation. They also contain functions for validating potential new circles, checking if two circles are tangent, and generating the next generation of circles. The `complexDescartes` function is used to calculate the curvatures and centers for new circles using Descartes' theorem.

## How It Works

The project uses Descartes' theorem to generate new circles in the gasket. Each circle is defined by its bend (curvature), center point, and depth. The center point is stored as a complex number, and the radius is derived from the absolute value of the reciprocal of the bend. The depth is also the generation number, and it's used to select a color for the circle.

The `complexDescartes` function in `sketch.js` calculates the curvatures and centers for new circles using Descartes' theorem. The resulting circles are added to the gasket and queued for processing in the next generation.

The creation of an Apollonian Gasket in this codebase kicks off with the `setup` function. This function, a mainstay in p5.js sketches, springs into action when the program starts. It's like a stage director, setting the scene by defining the initial environment properties such as screen size and background color, and cueing any necessary media such as images and fonts.

Once the stage is set, the `nextGeneration` function takes center stage. This function is the engine that propels the evolution of the gasket, meticulously generating the next generation of circles. It operates like a well-oiled assembly line, dequeuing circles from the queue, calculating the new circles that are tangent to them using the mathematical principles of Descartes' theorem, validating these new circles, and then adding the valid circles to the gasket and the queue.

The validation of new circles is a critical checkpoint in the generation of the gasket, and it's expertly handled by the `validate` function. This function acts as a gatekeeper, checking the validity of a potential new circle in the gasket. It ensures that the new circle is tangent to the existing circles and that it doesn't encroach on the territory of any other circles in the gasket.

Tangency is a key concept in the creation of an Apollonian Gasket, and the `isTangent` function is the arbiter of this property. It verifies if two circles are tangent to each other, meaning they intersect at exactly one point, much like two friends meeting at a coffee shop.

While the `nextGeneration`, `validate`, and `isTangent` functions are busy creating and validating new circles, the `draw` function brings the gasket to life. This function, another stalwart in p5.js sketches, executes the code that paints the visuals of the sketch. It's like a tireless artist, called into action continuously after `setup()`, executing the lines of code contained inside its block until the program is stopped or `noLoop()` is called.

Underpinning all these functions are the `descartes` and `complexDescartes` functions. These functions are the mathematical wizards, calculating the curvatures and centers for new circles using Descartes' theorem. The `descartes` function calculates the curvatures for new circles, taking three existing circles as input, calculating the sum and product of their curvatures, and then returning the two possible curvatures for a new circle that is tangent to the existing circles. The `complexDescartes` function extends this process, also calculating the centers for the new circles.

In this way, these functions work together harmoniously, each playing its part in the creation of the Apollonian Gasket. The `setup` function lays the groundwork, the `nextGeneration` function drives the evolution of the gasket, the `validate` and `isTangent` functions ensure the integrity of the gasket, the `draw` function brings the gasket to life, and the `descartes` and `complexDescartes` functions provide the mathematical foundation upon which the gasket is built. It's a symphony of code, each function a different instrument, playing together to create the beautiful melody that is the Apollonian Gasket.


## References
This project is inspired by few sources:
- ["The Apollonian Packing of Circles"](https://arxiv.org/pdf/math/0101066.pdf). This paper provides a detailed mathematical explanation of the Apollonian Gasket and the Descartes Circle Theorem.
- ["Apollonian gaskets"](https://mathlesstraveled.com/2016/04/27/apollonian-gaskets/). The page details the Apollonian gasket, a fractal formed by infinitely nesting circles within a curvilinear triangle created by three mutually tangent circles, and hints at future posts to explain the mathematics behind it