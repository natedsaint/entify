import Workers from './workers.js';
const ECS = {};

// namespace to store some stuff to get passed to all systems and their workers
ECS.globals = {};

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

ECS.Entity.destroy = function(id) {
  const idx = ECS.allEntities.findIndex((entity) => {
    return entity.id === id;
  });
  if (idx) {
    ECS.allEntities.splice(idx, 1);
  }
};

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
  this.work = () => {};
  this.setup = () => {};
  this.cleanup = () => {};
  this.globals = ECS.globals; // systems can use this directly but just in case, make a reference
  ECS.AllSystems.push(this);
  return this;
};

ECS.System.prototype.setName = function(name) {
  this.name = name;
  return this;
};

// NOTE: this overrides the setup, cleanup and work functions
ECS.System.prototype.workify = function(workerScript, numberOfWorkers) {
  this.oldSetup = this.setup;
  this.setup = async () => {
    await this.oldSetup();
    if (this.workers && this.workers.length) {
      this.workers.forEach((worker) => {
        worker.terminate();
      });
      this.workers.length = 0;
    }
    const numWorkers = numberOfWorkers || ECS.globals.workerCount;
    Workers.globals = ECS.globals;
    this.workers = Workers.createWorkers(numWorkers, workerScript);
  };

  this.oldWork = this.work;
  this.work = async () => {
    await this.oldWork();
    return await Workers.doDistributedWork(this.workers, ECS.allEntities)
      .then((results) => {
        let entities = [];
        results.forEach((event) => {
          entities = entities.concat(event.data);
        });
        ECS.allEntities = entities;
        return results;
      });
  };

  this.oldCleanup = this.cleanup;
  this.cleanup = async () => {
    await this.oldCleanup();
    if (this.workers && this.workers.length) {
      await Promise.all(this.workers.map(worker => worker.promise));
      await Promise.all(this.workers.map(worker => worker.terminate()));
      this.workers.length = 0;
    }
  };
};

ECS.start = async () => {
  await Promise.all(ECS.startSystems.map(system => system.work(ECS.allEntities)));
  await Promise.all(ECS.loopSystems.map((system) => system.setup()));
  ECS.playing = true;
  window.requestAnimationFrame(ECS.loop);
};

ECS.restart = async () => {
  ECS.playing = false;
  await ECS.reset();
  ECS.start();
};

ECS.pause = () => {
  ECS.playing = false;
};

ECS.play = () => {
  ECS.playing = true;
  window.requestAnimationFrame(ECS.loop);
};

ECS.reset = async () => {
  await Promise.all(ECS.startSystems.map(system => system.cleanup()));
  await Promise.all(ECS.loopSystems.map(system => system.cleanup()));
  ECS.allEntities.length = 0;
};

// now do work with the update loops
let stamp = performance.now();

ECS.loop = async () => {
  for (let system of ECS.loopSystems) {
    await system.work(ECS.allEntities);
  }
  const newStamp = performance.now();
  const delta = (newStamp - stamp) / 1000;
  ECS.fps = Math.round(1/delta) + ' fps';
  stamp = newStamp;
  if (ECS.playing) {
    window.requestAnimationFrame(ECS.loop);
  }
};

export default ECS;