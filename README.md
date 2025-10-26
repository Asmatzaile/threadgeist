# 🧵👻 Threadgeist

> [!IMPORTANT]
> Development moved to Codeberg! https://codeberg.org/Asmatzaile/threadgeist


This is a tool that can help you create a continuous line from an image!

You can then use the line as a SVG, and even process is further with other programs to get instructions for an embroidery machine or a pen plotter, for example.

I was inspired by [Huw Messie](https://huwmessie.com/)'s stitching animations that [Susi Jirkuff](https://de.wikipedia.org/wiki/Susi_Jirkuff) showed us at the Animation Laboratory class in the Summer Semester of the 2024-2025 schoolyear at the Kunstuniversität Linz (Austria).

## Aknowledgments

- Huw Messie's [Stitches in motion](https://huwmessie.com/2019/12/17/stitches-in-motion/) post, that explains Huw's process for converting an image to a fill path.
- Adrian Secord for the [Weighted Voronoi Stippling](https://www.cs.ubc.ca/labs/imager/tr/2002/secord2002b/secord.2002b.pdf) paper.
- The Coding Train's [Weighted Voronoi Stippling video](https://youtu.be/Bxdt6T_1qgc) for helping me getting an insight and Mike Bostock's [Voronoi Stippling notebook](https://observablehq.com/@mbostock/voronoi-stippling) for the implementation, licensed under ISC and located in [src/stippler.worker.js](src/stippler.worker.js)
- [d3's findInCircle function](https://observablehq.com/@d3/quadtree-findincircle), licensed under ISC and located in [src/thirdparty/findInCircle.js](src/thirdparty/findInCircle.js)
- [Phosphor Icons](https://phosphoricons.com/)

## Things I learned

There are some concepts that were new for me and I tackled in this project:
 - The basics of using web workers
 - Getting images to the canvas
 - Optimizing point lookup with quadtrees

