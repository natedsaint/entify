import Entify from './Entify.js';
import Systems from './systems.js';

let c;

let PAUSE_TXT = '&#10074; &#10074;';
let PLAY_TXT = '&#9654;';

// Implementation

Entify.globals.width = 800;
Entify.globals.height = 600;

// gonna use a canvas on the page
c = document.getElementById('c');
c.width = Entify.globals.width;
c.height = Entify.globals.height;
if (c.transferControlToOffscreen) {
  Entify.globals.offscreen = true;
} else {
  Entify.globals.offscreen = false;
}

// now we need to pass the canvas/context into places that need it
Entify.globals.c = c;
// we can get c.width and height most places, but not in workers


// initial numDots (changed with form on page)
Systems.generatorSystem.numDots = 200;

// register start systems
Entify.startSystems = [Systems.generatorSystem];

// register loop systems
Entify.loopSystems = [
  Systems.colliderSystem,
  Systems.moverSystem,
  Systems.drawerSystem,
  Systems.clickerSystem,
];

// let's party!
Entify.start();

// let the user party!
document.querySelector('#pause').addEventListener('click', (event) => {
  if (Entify.playing) {
    Entify.pause();
    event.target.innerHTML = PLAY_TXT;
  } else {
    Entify.play();
    event.target.innerHTML = PAUSE_TXT;
  }
});
document.querySelector('#restart').addEventListener('click', async () => {
  Entify.pause();
  Systems.generatorSystem.numDots = parseInt(document.querySelector('#dotsInput').value);
  Entify.globals.workerCount = parseInt(document.querySelector('#workersInput').value);
  Entify.restart();
  document.querySelector('#pause').innerHTML = PAUSE_TXT;
});

c.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
