import ECS from './ecs.js';
import Assemblages from './assemblages.js';
import Utils from './util.js';

const getRandomInt = Utils.getRandomInt;

// setup configs

const generatorSystem = new ECS.System('generator');

generatorSystem.work = () => {
  let numDots = generatorSystem.numDots;
  let ratio = c.width / c.height;
  // TODO: still doesn't look right, find out why
  let cols = Math.ceil(Math.sqrt(numDots * ratio));
  let rows = Math.ceil(Math.sqrt(numDots / ratio));
  let pixelsPerCol = c.width/cols;
  let pixelsPerRow = c.height/rows;
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

colliderSystem.workify('collider.js');

const moverSystem = new ECS.System('mover');

moverSystem.workify('mover.js');

const drawerSystem = new ECS.System('drawer');
drawerSystem.work = async () => {
  drawerSystem.globals.ctx.clearRect(0,0,ECS.globals.c.width,ECS.globals.c.height);
  ECS.allEntities.forEach((entity) => {
    const color = entity.components.color;
    const size = entity.components.size;
    const position = entity.components.position;
    ECS.globals.ctx.beginPath();
    ECS.globals.ctx.fillStyle = `hsl(${color.h}, ${color.s}, ${color.l})`;
    ECS.globals.ctx.strokeStyle = `hsl(${color.h + 180}, ${color.s}, ${color.l})`;
    ECS.globals.ctx.arc(position.x, position.y, size.radius, 0, 2 * Math.PI);
    ECS.globals.ctx.stroke();
    ECS.globals.ctx.fill();
  });
  return ECS.allEntities;
};

drawerSystem.setup = () => {
  ECS.globals.ctx.clearRect(0,0,ECS.globals.c.width,ECS.globals.c.height);
};

const clickerSystem = new ECS.System('clicker');
clickerSystem.work = async () => {
  clickerSystem.clicks.forEach((click) => {
    const size = getRandomInt(10) + 3;
    const color = {
      h : getRandomInt(360),
      s : '60%', 
      l : '50%',
    };
    const position = {
      x: click[0],
      y: click[1],
    };
    const xSign = (!!getRandomInt(1)) ? 1 : -1;
    const ySign = (!!getRandomInt(1)) ? 1 : -1;
    const velocity = {
      x: getRandomInt(6) + 1 * xSign,
      y: getRandomInt(6) + 1 * ySign,
    };
    new Assemblages.Dot(size, color, position, velocity);
  });
  clickerSystem.clicks.length = 0;
};

clickerSystem.setup = () => {
  let mousedown = false;
  clickerSystem.clicks = [];
  ECS.globals.c.addEventListener('mousedown', (event) => {
    mousedown = true;
    clickerSystem.clicks.push([event.layerX, event.layerY]);
  });
  ECS.globals.c.addEventListener('mousemove', (event) => {
    if (mousedown) {
      clickerSystem.clicks.push([event.layerX, event.layerY]);
    }
  });
  ECS.globals.c.addEventListener('mouseup', () => {
    mousedown = false;
  });
};

const perfSystem = new ECS.System('perf');
perfSystem.setup = () => {
  perfSystem.fpsCounter = 0;
  perfSystem.fpsText = '';
  perfSystem.textStyle = '32px helvetica';
  perfSystem.textColor = '#fff';
};

perfSystem.work = () => {
  perfSystem.fpsCounter++;
  ECS.globals.ctx.font = perfSystem.textStyle;
  ECS.globals.ctx.fillStyle = perfSystem.textColor;
  ECS.globals.ctx.fillText(perfSystem.fpsText, 10, 50);
  // only update it every 10 frames
  if (perfSystem.fpsCounter % 10 === 0) {
    perfSystem.fpsText = ECS.fps;
    perfSystem.fpsCounter = 0;
  }
};

export default {
  generatorSystem,
  colliderSystem,
  moverSystem,
  drawerSystem,
  clickerSystem,
  perfSystem,
};