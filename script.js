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

// Assemblages

ECS.Assemblages = {
  Dot: function(size, color, position) {
    let entity = new ECS.Entity();
    let red = color.r || 0;
    let blue = color.b || 0;
    let green = color.g || 0;
    let alpha = color.a || 0;
    let posY = position.y;
    let posX = position.x;
    entity.addComponent(new ECS.Components.Color(red, green, blue, alpha));
    entity.addComponent(new ECS.Components.Size(size));
    entity.addComponent(new ECS.Components.Position(posX,posY));
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

ECS.loop = () => {
  ECS.loopSystems.forEach((system) => {
    system.work(ECS.allEntities);
  });
  if (ECS.playing) {
    window.requestAnimationFrame(ECS.loop);
  }
};


// Implementation
const c = document.getElementById('c');
const ctx = c.getContext('2d', { alpha: false });

c.width = 1024;
c.height = 1024;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const generatorSystem = new ECS.System('generator');
generatorSystem.work = () => {
  let numDots = 50;
  while (numDots--) {
    // TODO: create random color, and size, and position
    const color = {
       r : getRandomInt(255),
       g : getRandomInt(255), 
       b : getRandomInt(255),
       a : Math.random(),
    };
    const size = getRandomInt(10);
    const position = {
      x: getRandomInt(1024),
      y: getRandomInt(1024)
    }
    new ECS.Assemblages.Dot(size, color, position);
  }
  ECS.playing = true;
};

const moverSystem = new ECS.System('mover');
moverSystem.getClosestDot = (from) => {
  const fromId = from.id;
  const fromPosition = from.components.position;
  let closestDist = 2048;
  let closestEntity;
  ECS.allEntities.forEach((entity) => {
    if (entity.id !== fromId) {
      const toPosition = entity.components.position;
      const distanceX = fromPosition.x - toPosition.x;
      const distanceY = fromPosition.y - toPosition.y;
      const dist = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closestEntity = entity;
      }
    }
  });
  return [closestEntity, closestDist];
};
moverSystem.work = () => {
  ECS.allEntities.forEach((entity) => {
    const position = entity.components.position;
    const [targetEntity, targetDistance] = moverSystem.getClosestDot(entity);
    const targetPosition = targetEntity.components.position;
    const distanceX = Math.abs(position.x - targetPosition.x);
    const distanceY = Math.abs(position.y - targetPosition.y);
    const angle = Math.atan2(position.x - targetPosition.x, position.y - targetPosition.y);
    let targetX = position.x + Math.cos(angle) * (distanceX / 100);
    let targetY = position.y + Math.sin(angle) * (distanceY / 100);
    position.x = Math.max(0, Math.min(1024, targetX));
    position.y = Math.max(0, Math.min(1024, targetY));
  });
};

const drawerSystem = new ECS.System('drawer');
drawerSystem.work = () => {
  // ctx.fillStyle = '#000000';
  // ctx.fillRect(0, 0, c.length, c.width);
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
};

ECS.startSystems = [generatorSystem];
ECS.loopSystems = [moverSystem, drawerSystem];
ECS.start();
