import Workers from './workers.js';
const ECS = {};
Workers.ECS = ECS;

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
  this.postSetup = () => {};
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
// initData is thunk that returns an object in the form 
//   {data: data, transferrables: transferrables}
ECS.System.prototype.workify = function(workerScript, numberOfWorkers, getInitData) {
  const oldSetup = this.setup.bind(this);
  this.setup = async () => {
    await oldSetup();
    if (this.workers && this.workers.length) {
      this.workers.forEach((worker) => {
        worker.terminate();
      });
      this.workers.length = 0;
    }
    const numWorkers = numberOfWorkers || ECS.globals.workerCount;
    Workers.globals = ECS.globals;
    this.workers = Workers.createWorkers(numWorkers, workerScript);
    // in the event your worker(s) need initialization
    if (getInitData) {
      for (let worker of this.workers) {
        const initData = getInitData();
        await Workers.doInit(worker, initData.data, initData.transferrables);
      }
      return;
    } else {
      return;
    }
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
      for (const worker of this.workers) {
        await worker.promise;
      }
      for (const worker of this.workers) {
        await Workers.destroyWorker(worker);
      }
      this.workers.length = 0;
    }
    return;
  };
};

ECS.start = async () => {
  for (const system of ECS.startSystems) {
    await system.work(ECS.allEntities);
  }
  for (const system of ECS.loopSystems) {
    await system.setup();
  }
  ECS.playing = true;
  window.requestAnimationFrame(ECS.loop);
};

ECS.restart = async () => {
  ECS.playing = false;
  await ECS.reset();
  window.requestAnimationFrame(ECS.start);
};

ECS.pause = () => {
  ECS.playing = false;
};

ECS.play = () => {
  ECS.playing = true;
  window.requestAnimationFrame(ECS.loop);
};

ECS.reset = async () => {
  for (const system of ECS.startSystems) {
    await system.cleanup();
  }
  for (const system of ECS.loopSystems) {
    await system.cleanup();
  }
  ECS.allEntities.length = 0;
  return;
};

// now do work with the update loops
let stamp = performance.now();

ECS.loop = async () => {
  for (let system of ECS.loopSystems) {
    await system.work(ECS.allEntities);
  }
  const newStamp = performance.now();
  const delta = (newStamp - stamp) / 1000;
  ECS.fps = Math.round(1/delta);
  stamp = newStamp;
  if (ECS.playing) {
    window.requestAnimationFrame(ECS.loop);
  }
};

export default ECS;