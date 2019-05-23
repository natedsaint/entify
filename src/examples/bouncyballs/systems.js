import ECS from './ecs.js';
import Assemblages from './assemblages.js';
import Workers from './workers.js';
import Utils from './util.js';

const getRandomInt = Utils.getRandomInt;

// setup configs

const generatorSystem = new ECS.System('generator');

generatorSystem.work = () => {
  let numDots = generatorSystem.numDots;
  let cols = Math.ceil(Math.sqrt(numDots));
  let rows = Math.ceil(Math.sqrt(numDots));
  let pixelsPerCol = 1024/cols;
  let pixelsPerRow = 1024/rows;
  let row = 0;
  let col = 0;
  while (numDots--) {
    const color = {
       h : getRandomInt(360),
       s : '60%', 
       l : '50%',
    };
    const size = getRandomInt(10) + 3;
    if (col < cols) {
      col++;
    } else {
      col = 0;
      row++;
    }
    const x = ( row + 1 ) * pixelsPerRow + 15;
    const y = ( col + 1 ) * pixelsPerCol + 15;
    const position = { x, y };
    const xSign = (!!getRandomInt(1)) ? 1 : -1;
    const ySign = (!!getRandomInt(1)) ? 1 : -1;
    const velocity = {
      x: getRandomInt(6) + 1 * xSign,
      y: getRandomInt(6) + 1 * ySign,
    };
    new Assemblages.Dot(size, color, position, velocity);
  }
};

const colliderSystem = new ECS.System('collider');

colliderSystem.setup = () => {
  if (colliderSystem.workers) {
    colliderSystem.workers.forEach((worker) => {
      worker.terminate();
    });
    colliderSystem.workers.length = 0;
  }
  colliderSystem.workers = Workers.createWorkers('collider.js');
};

colliderSystem.work = async () => {
  return await Workers.doDistributedWork(colliderSystem.workers, ECS.allEntities)
    .then((results) => {
      let entities = [];
      results.forEach((event) => {
        entities = entities.concat(event.data);
      });
      ECS.allEntities = entities;
      return results;
    });
};

const moverSystem = new ECS.System('mover');

moverSystem.setup = () => {
  if (moverSystem.workers) {
    moverSystem.workers.forEach((worker) => {
      worker.terminate();
    });
    moverSystem.workers.length = 0;
  }
  moverSystem.workers = Workers.createWorkers('mover.js');
};

moverSystem.work = async () => {
  return await Workers.doDistributedWork(moverSystem.workers, ECS.allEntities)
    .then((results) => {
      let entities = [];
      results.forEach((event) => {
        entities = entities.concat(event.data);
      });
      ECS.allEntities = entities;
      return results;
    });
};

const drawerSystem = new ECS.System('drawer');
drawerSystem.work = async () => {
  drawerSystem.ctx.clearRect(0,0,drawerSystem.c.width,drawerSystem.c.height);
  ECS.allEntities.forEach((entity) => {
    const color = entity.components.color;
    const size = entity.components.size;
    const position = entity.components.position;
    drawerSystem.ctx.beginPath();
    drawerSystem.ctx.fillStyle = `hsl(${color.h}, ${color.s}, ${color.l})`;
    drawerSystem.ctx.strokeStyle = `hsl(${color.h + 180}, ${color.s}, ${color.l})`;
    drawerSystem.ctx.arc(position.x, position.y, size.radius, 0, 2 * Math.PI);
    drawerSystem.ctx.stroke();
    drawerSystem.ctx.fill();
  });
  return ECS.allEntities;
};

drawerSystem.setup = () => {
  drawerSystem.ctx.clearRect(0,0,drawerSystem.c.width,drawerSystem.c.height);
};

export default {
  generatorSystem,
  colliderSystem,
  moverSystem,
  drawerSystem,
};