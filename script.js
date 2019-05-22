// TODO: 
// 1) split this out
const Workers = {
 createWorkers(workerCount, src) {
    var workers = new Array(workerCount);
    for (var i = 0; i < workerCount; i++) {
        workers[i] = new Worker(src);
    }
    return workers;
  },
  doWork(worker, data, allData) {
    return new Promise(function(resolve, reject) {
        worker.onmessage = resolve;
        worker.postMessage({ chunk: data, allData });
    });
  },
  doDistributedWork(workers, data) {
    // data size is always a multiple of the number of workers
    var elementsPerWorker = data.length / workers.length;
    return Promise.all(workers.map(function(worker, index) {
        var start = index * elementsPerWorker;
        return Workers.doWork(worker, data.slice(start, start+elementsPerWorker), data);
    }));
  }
};

const WORKER_COUNT = 5;
const movers = Workers.createWorkers(WORKER_COUNT, 'mover.js');
const colliders = Workers.createWorkers(WORKER_COUNT, 'collider.js');

const ECS = {};
// E
ECS.allEntities = [];
ECS.Entity = function () {
  this.id = (+new Date()).toString(16) + 
  (Math.random() * 100000000 | 0).toString(16) +
  ECS.Entity.prototype.count;
  ECS.Entity.prototype.count++;
  this.components = {};
  ECS.allEntities.push(this);
  return this;
};
ECS.Entity.prototype.count = 0;

ECS.Entity.prototype.print = function () {
  console.log(JSON.stringify(this, null, 4));
  return this;
};

// C
ECS.Entity.prototype.addComponent = function ( component ){
  this.components[component.name] = component;
  return this;
};

ECS.Entity.prototype.removeComponent = function ( componentName ){
  var name = componentName; // assume a string was passed in

  if(typeof componentName === 'function'){ 
      name = componentName.prototype.name;
  }

  delete this.components[name];
  return this;
};

ECS.Components = {}; 
// S

ECS.AllSystems = [];
ECS.System = function(name) {
  this.setName(name);
  ECS.AllSystems.push(this);
  return this;
};

ECS.System.prototype.setName = function(name) {
  this.name = name;
  return this;
};

// ECS.System.prototype.work = function(entities) {
//   // stub
//   return entities;
// };

// Implementation

// Components
ECS.Components.Color = function(r = 0, g = 0, b = 0, a = 0) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
  return this;
};

ECS.Components.Color.prototype.name = 'color';

ECS.Components.Position = function(x=0, y=0) {
  this.x = x;
  this.y = y;
  return this;
};

ECS.Components.Position.prototype.name = 'position';

ECS.Components.Size = function(radius=0.1) {
  this.radius = radius;
  return this;
}

ECS.Components.Size.prototype.name = 'size';

ECS.Components.Velocity = function(angle=0, magnitude=1) {
  this.angle = angle;
  this.magnitude = magnitude;
  return this;
} 

ECS.Components.Velocity.prototype.name = 'velocity';

// Assemblages

ECS.Assemblages = {
  Dot: function(size, color, position, velocity) {
    let entity = new ECS.Entity();
    let red = color.r || 0;
    let blue = color.b || 0;
    let green = color.g || 0;
    let alpha = color.a || 0;
    let posY = position.y;
    let posX = position.x;
    let velAngle = velocity.angle;
    let velMagnitude = velocity.magnitude;
    entity.addComponent(new ECS.Components.Color(red, green, blue, alpha));
    entity.addComponent(new ECS.Components.Size(size));
    entity.addComponent(new ECS.Components.Position(posX,posY));
    entity.addComponent(new ECS.Components.Velocity(velAngle, velMagnitude));
    return entity;
  }
};

// Link everything up

// start app with start systems

ECS.start = () => {
  ECS.startSystems.forEach((system) => {
    system.work(ECS.allEntities);
  });
  window.requestAnimationFrame(ECS.loop);
};

// now do work with the update loops
let stamp = performance.now();
let fpscounter = 0;
ECS.loop = async () => {
  for (system of ECS.loopSystems) {
    await system.work(ECS.allEntities);
  }
  const newStamp = performance.now();
  const delta = (newStamp - stamp) / 1000;
  fpscounter++;
  if (fpscounter % 10 === 0) {
    document.querySelector('#fps').innerHTML = Math.round(1/delta) + ' fps';
    fpscounter = 0;
  }
  stamp = newStamp;
  if (ECS.playing) {
    window.requestAnimationFrame(ECS.loop);
  }
};


// Implementation
const c = document.getElementById('c');
const ctx = c.getContext('2d', { alpha: true });

c.width = 1024;
c.height = 1024;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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
    new ECS.Assemblages.Dot(size, color, position, velocity);
  }
  ECS.playing = true;
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
  ctx.clearRect(0,0,c.width,c.height);
  ECS.allEntities.forEach((entity) => {
    const color = entity.components.color;
    const size = entity.components.size;
    const position = entity.components.position;
    ctx.beginPath();
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    ctx.arc(position.x, position.y, size.radius, 0, 2 * Math.PI);
    ctx.fill();
  });
  return ECS.allEntities;
};

ECS.startSystems = [generatorSystem];
ECS.loopSystems = [colliderSystem, moverSystem, drawerSystem];
ECS.start();
