import Entify from './Entify.js';
import Assemblages from './assemblages.js';
import Utils from './util.js';

const getRandomInt = Utils.getRandomInt;

// setup configs

const generatorSystem = new Entify.System('generator');

generatorSystem.work = () => {
  let numDots = generatorSystem.numDots;
  let ratio = c.width / c.height;
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

const colliderSystem = new Entify.System('collider');

colliderSystem.workify('collider.js');

const moverSystem = new Entify.System('mover');

moverSystem.workify('mover.js');

const drawerSystem = new Entify.System('drawer');

drawerSystem.setup = async () => {
  if (!Entify.globals.offscreen) {
    Entify.globals.ctx = Entify.globals.c.getContext('2d', { alpha: true });
    drawerSystem.perfCounter = 0;
    return;
  }
};

drawerSystem.work = async () => {
  if (!Entify.globals.offscreen) {
    const ctx = Entify.globals.ctx;
    drawerSystem.perfCounter++;
    ctx.clearRect(0,0,Entify.globals.c.width,Entify.globals.c.height);
    Entify.allEntities.forEach((entity) => {
      const color = entity.components.color;
      const size = entity.components.size;
      const position = entity.components.position;
      ctx.beginPath();
      ctx.fillStyle = `hsl(${color.h}, ${color.s}, ${color.l})`;
      ctx.strokeStyle = `hsl(${color.h + 180}, ${color.s}, ${color.l})`;
      ctx.arc(position.x, position.y, size.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    });
    if (drawerSystem.perfCounter % 30 === 0 ||
      (!drawerSystem.perfText && Entify.fps)) {
      drawerSystem.perfCounter = 0;
      drawerSystem.perfText = Entify.fps + ' fps';
    }
    ctx.font = '32px helvetica';
    ctx.fillStyle = '#fff';
    ctx.fillText(drawerSystem.perfText, 10, 50);
  }
  return Entify.allEntities;
};

// you can't transfer the offscreen canvas to multiple workers... yet?
// you also have make a new canvas to pass to the new worker thread
drawerSystem.workify('drawer.js', 1, () => {
  if (Entify.globals.offscreen) {
    const canvas = Entify.globals.c;
    const newCanvas = canvas.cloneNode();
    const canvasParent = canvas.parentNode;
    canvasParent.removeChild(canvas);
    canvasParent.appendChild(newCanvas);
    Entify.globals.c = newCanvas;
  
    const offscreen = Entify.globals.c.transferControlToOffscreen();
    return {
      data: offscreen, 
      transferrables: offscreen,
    };
  }
  return false;
});

const clickerSystem = new Entify.System('clicker');
clickerSystem.work = async () => {
  clickerSystem.clicks.forEach((click) => {
    if (click[2] === 0) {
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
    } else if (click[2] === 2) { // right click
      Entify.allEntities.forEach((dot) => {
        const [mouseX, mouseY] = click;
        const { x, y } = dot.components.position;
        const { radius } = dot.components.size;
        const intersect = Math.hypot(mouseX-x, mouseY - y) <= (1 + radius);
        if (intersect) {
          Entify.Entity.destroy(dot.id);
        }
      });
    }
  });
  clickerSystem.clicks.length = 0;
};

clickerSystem.setup = () => {
  let mousedown = false;
  clickerSystem.clicks = [];
  Entify.globals.c.addEventListener('mousedown', (event) => {
    mousedown = event.button;
    clickerSystem.clicks.push([event.layerX, event.layerY, event.button]);
  });
  Entify.globals.c.addEventListener('mousemove', (event) => {
    if (mousedown === 0 || mousedown === 2) {
      clickerSystem.clicks.push([event.layerX, event.layerY, mousedown]);
    }
  });
  Entify.globals.c.addEventListener('mouseup', () => {
    mousedown = false;
  });
  Entify.globals.c.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
};

export default {
  generatorSystem,
  colliderSystem,
  moverSystem,
  drawerSystem,
  clickerSystem,
};