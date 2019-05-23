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

ECS.start = () => {
  ECS.startSystems.forEach((system) => {
    system.work(ECS.allEntities);
  });
  ECS.loopSystems.forEach((system) => {
    system.setup();
  });
  ECS.playing = true;
  window.requestAnimationFrame(ECS.loop);
};

ECS.restart = () => {
  ECS.playing = false;
  requestAnimationFrame(ECS.reset);
};

ECS.pause = () => {
  ECS.playing = false;
};

ECS.play = () => {
  ECS.playing = true;
  window.requestAnimationFrame(ECS.loop);
};

ECS.reset = () => {
  ECS.allEntities.length = 0;
  requestAnimationFrame(ECS.start);
};

// now do work with the update loops
let stamp = performance.now();
let fpscounter = 0;

ECS.loop = async () => {
  for (let system of ECS.loopSystems) {
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

export default ECS;