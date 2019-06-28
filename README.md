<p align="center">
  <img src="/entify.png">
</p>

# FAQ

## WTF IS THIS? 

### ECS
[Entity Component Systems](https://en.wikipedia.org/wiki/Entity_component_system) are a way of 
designing systems around a [data-oriented design](https://en.wikipedia.org/wiki/Data-oriented_design) philosophy.

It's used in Unity's new tech stack, [DOTS](https://unity.com/dots). 

## Okay but what is Entify?
Entify is a library designed to take advantage of several aspects of data-oriented design in the JS environment. 

1. Using entities as abstractions flattens the tree of all of the things you need rather than looking
at the DOM as a huge multi-pronged tree. 
2. Using iteration allows us to parallelize tasks across multiple threads using [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). 
3. Abstracting systems allows us to think in a way that organizes information quickly and easily, and 
most forms of optimizations (rendering using canvas, lots of calculations) are easier to do by iteration.

## Okay but why did you make a whole new library?

1. Yes, ECS has been done in JS, and it already exists in various npm modules already. But I wanted to solve
specific problems that most of these ECS implementatiins were not designed to address (specifically 
using bleeding-edge -- aka not yet standardized-- technology like offscreen canvases and the performance api). 

2. I had some time to try to learn how to do some tech I'd never worked with for Unity hackweek, and after 
repeatedly failing to get various other projects going I came back to this one to try to get it to a point
where it was stable enough to build a game engine on top of it. I'm working on that now.