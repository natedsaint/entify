import ECS from './ecs.js';
import Systems from './systems.js';

let c;
let ctx;

// Implementation
document.addEventListener('DOMContentLoaded', () => {
  c = document.getElementById('c');
  ctx = c.getContext('2d', { alpha: true });
  Systems.drawerSystem.ctx = ctx;
  
  c.width = 1024;
  c.height = 1024;
  
  ECS.startSystems = [Systems.generatorSystem];
  ECS.loopSystems = [Systems.colliderSystem, Systems.moverSystem, Systems.drawerSystem];
  ECS.start();
}, false);

