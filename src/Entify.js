import Workers from './workers.js';
const Entify = {};
Workers.Entify = Entify;

// namespace to store some stuff to get passed to all systems and their workers
Entify.globals = {};

// E
Entify.allEntities = [];
Entify.Entity = function () {
  this.id = (+new Date()).toString(16) + 
  (Math.random() * 100000000 | 0).toString(16) +
  Entify.Entity.prototype.count;
  Entify.Entity.prototype.count++;
  this.components = {};
  Entify.allEntities.push(this);
  return this;
};
Entify.Entity.prototype.count = 0;

Entify.Entity.destroy = function(id) {
  const idx = Entify.allEntities.findIndex((entity) => {
    return entity.id === id;
  });
  if (idx) {
    Entify.allEntities.splice(idx, 1);
  }
};

Entify.Entity.prototype.print = function () {
  console.log(JSON.stringify(this, null, 4));
  return this;
};

// C
Entify.Entity.prototype.addComponent = function ( component ){
  this.components[component.name] = component;
  return this;
};

Entify.Entity.prototype.removeComponent = function ( componentName ){
  var name = componentName; // assume a string was passed in

  if(typeof componentName === 'function'){ 
    name = componentName.prototype.name;
  }

  delete this.components[name];
  return this;
};

Entify.Components = {}; 

// S
Entify.AllSystems = [];
Entify.System = function(name) {
  this.setName(name);
  this.work = () => {};
  this.setup = () => {};
  this.postSetup = () => {};
  this.cleanup = () => {};
  this.globals = Entify.globals; // systems can use this directly but just in case, make a reference
  Entify.AllSystems.push(this);
  return this;
};

Entify.System.prototype.setName = function(name) {
  this.name = name;
  return this;
};

// NOTE: this overrides the setup, cleanup and work functions
// initData is thunk that returns an object in the form 
//   {data: data, transferrables: transferrables}
Entify.System.prototype.workify = function(workerScript, numberOfWorkers, getInitData) {
  const oldSetup = this.setup.bind(this);
  this.setup = async () => {
    await oldSetup();
    if (this.workers && this.workers.length) {
      this.workers.forEach((worker) => {
        worker.terminate();
      });
      this.workers.length = 0;
    }
    const numWorkers = numberOfWorkers || Entify.globals.workerCount;
    Workers.globals = Entify.globals;
    this.workers = Workers.createWorkers(numWorkers, workerScript);
    // in the event your worker(s) need initialization
    if (getInitData) {
      for (let worker of this.workers) {
        const initData = getInitData();
        if (initData) {
          await Workers.doInit(worker, initData.data, initData.transferrables);
        }
      }
      return;
    } else {
      return;
    }
  };

  this.oldWork = this.work;
  this.work = async () => {
    await this.oldWork();
    return await Workers.doDistributedWork(this.workers, Entify.allEntities)
      .then((results) => {
        let entities = [];
        results.forEach((event) => {
          entities = entities.concat(event.data);
        });
        Entify.allEntities = entities;
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

Entify.start = async () => {
  for (const system of Entify.startSystems) {
    await system.work(Entify.allEntities);
  }
  for (const system of Entify.loopSystems) {
    await system.setup();
  }
  Entify.playing = true;
  window.requestAnimationFrame(Entify.loop);
};

Entify.restart = async () => {
  Entify.playing = false;
  await Entify.reset();
  window.requestAnimationFrame(Entify.start);
};

Entify.pause = () => {
  Entify.playing = false;
};

Entify.play = () => {
  Entify.playing = true;
  window.requestAnimationFrame(Entify.loop);
};

Entify.reset = async () => {
  for (const system of Entify.startSystems) {
    await system.cleanup();
  }
  for (const system of Entify.loopSystems) {
    await system.cleanup();
  }
  Entify.allEntities.length = 0;
  return;
};

// now do work with the update loops
let stamp = performance.now();

Entify.loop = async () => {
  for (let system of Entify.loopSystems) {
    await system.work(Entify.allEntities);
  }
  const newStamp = performance.now();
  const delta = (newStamp - stamp);
  Entify.deltaTime = delta;
  const deltaSeconds = delta / 1000;
  Entify.fps = Math.round(1/deltaSeconds);
  stamp = newStamp;
  if (Entify.playing) {
    window.requestAnimationFrame(Entify.loop);
  }
};

export default Entify;