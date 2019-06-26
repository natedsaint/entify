import ECS from '../../ecs.js';
import Systems from './systems.js';

let c;

let PAUSE_TXT = '&#10074; &#10074;';
let PLAY_TXT = '&#9654;';

// Implementation

ECS.globals.width = 800;
ECS.globals.height = 600;

// gonna use a canvas on the page
c = document.getElementById('c');
c.width = ECS.globals.width;
c.height = ECS.globals.height;

// now we need to pass the canvas/context into places that need it
ECS.globals.c = c;
// we can get c.width and height most places, but not in workers


// initial numDots (changed with form on page)
Systems.generatorSystem.numDots = 200;

// register start systems
ECS.startSystems = [Systems.generatorSystem];

// register loop systems
ECS.loopSystems = [
  Systems.colliderSystem,
  Systems.moverSystem,
  Systems.drawerSystem,
  Systems.clickerSystem,
];

// let's party!
ECS.start();

// let the user party!
document.querySelector('#pause').addEventListener('click', (event) => {
  if (ECS.playing) {
    ECS.pause();
    event.target.innerHTML = PLAY_TXT;
  } else {
    ECS.play();
    event.target.innerHTML = PAUSE_TXT;
  }
});
document.querySelector('#restart').addEventListener('click', async () => {
  ECS.pause();
  Systems.generatorSystem.numDots = parseInt(document.querySelector('#dotsInput').value);
  ECS.globals.workerCount = parseInt(document.querySelector('#workersInput').value);
  ECS.restart();
  document.querySelector('#pause').innerHTML = PAUSE_TXT;
});

c.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
