import ECS from './ecs.js';
import Assemblages from './assemblages.js';
import Workers from './workers.js';
import Utils from './util.js';

const getRandomInt = Utils.getRandomInt;

// setup configs
const WORKER_COUNT = 5;
const movers = Workers.createWorkers(WORKER_COUNT, 'mover.js');
const colliders = Workers.createWorkers(WORKER_COUNT, 'collider.js');

const generatorSystem = new ECS.System('generator');
generatorSystem.work = () => {
  let numDots = 200;
  while (numDots--) {
    const color = {
       r : getRandomInt(255),
       g : getRandomInt(255), 
       b : getRandomInt(255),
       a : Math.random(),
    };
    const size = getRandomInt(10) + 3;
    const position = {
      x: getRandomInt(1024),
      y: getRandomInt(1024)
    }
    const velocity = {
      angle: getRandomInt(360),
      magnitude: getRandomInt(5) + 1,
    }
    new Assemblages.Dot(size, color, position, velocity);
  }
};

const colliderSystem = new ECS.System('collider');

colliderSystem.work = async () => {
  return await Workers.doDistributedWork(colliders, ECS.allEntities)
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

moverSystem.work = async () => {
  return await Workers.doDistributedWork(movers, ECS.allEntities)
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
  drawerSystem.ctx.clearRect(0,0,c.width,c.height);
  ECS.allEntities.forEach((entity) => {
    const color = entity.components.color;
    const size = entity.components.size;
    const position = entity.components.position;
    drawerSystem.ctx.beginPath();
    drawerSystem.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    drawerSystem.ctx.arc(position.x, position.y, size.radius, 0, 2 * Math.PI);
    drawerSystem.ctx.fill();
  });
  return ECS.allEntities;
};

export default {
  generatorSystem,
  colliderSystem,
  moverSystem,
  drawerSystem,
  WORKER_COUNT,
};