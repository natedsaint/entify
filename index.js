import ECS from './ecs.js';
import Systems from './systems.js';
import Workers from './workers.js';

let c;
let ctx;

let PAUSE_TXT = '&#10074; &#10074;';
let PLAY_TXT = '&#9654;';

// Implementation
document.addEventListener('DOMContentLoaded', () => {
  c = document.getElementById('c');
  ctx = c.getContext('2d', { alpha: true });
  Systems.drawerSystem.ctx = ctx;
  Systems.drawerSystem.c = c;
  Systems.generatorSystem.numDots = 200;
  
  c.width = 1024;
  c.height = 1024;
  
  ECS.startSystems = [Systems.generatorSystem];
  ECS.loopSystems = [Systems.colliderSystem, Systems.moverSystem, Systems.drawerSystem];
  ECS.start();
  bindButtons();
}, false);

const bindButtons = () => {
  document.querySelector('#pause').addEventListener('click', (event) => {
    if (ECS.playing) {
      ECS.pause();
      event.target.innerHTML = PLAY_TXT;
    } else {
      ECS.play();
      event.target.innerHTML = PAUSE_TXT;
    }
  });
  document.querySelector('#restart').addEventListener('click', () => {
    ECS.pause();
    Systems.generatorSystem.numDots = parseInt(document.querySelector('#dotsInput').value);
    Workers.WORKER_COUNT = parseInt(document.querySelector('#workersInput').value);
    ECS.restart();
    document.querySelector('#pause').innerHTML = PAUSE_TXT;
  });
};
