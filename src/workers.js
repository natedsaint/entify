const Workers = {
  ECS: {},
  globals: {},
  workerCount: 0,
  async destroyWorker(worker) {
    await worker.terminate();
    Workers.workerCount--;
    return;
  },
  createWorkers(numWorkers=5, src) {
    let workers = new Array(numWorkers);
    for (var i = 0; i < numWorkers; i++) {
      workers[i] = new Worker(src);
    }
    Workers.workerCount += numWorkers;
    return workers;
  },
  doWork(worker, data, allData) {
    return new Promise((resolve, reject) => {
      worker.onmessage = resolve;
      worker.onerror = reject;
      worker.postMessage({ 
        chunk: data,
        allData,
        fps: Workers.ECS.fps,
        globals: JSON.stringify(Workers.globals),
      });
    });
  },
  doInit(worker, data, transferrables) {
    const tfer = (transferrables) ? [transferrables] : undefined;
    return new Promise((resolve, reject) => {
      worker.onmessage = resolve;
      worker.onerror = reject;
      worker.postMessage({
        init: true,
        data,
        transferrables,
      }, tfer);
    });
  },
  doDistributedWork(workers, data) {
    // data size is always a multiple of the number of workers
    var elementsPerWorker = data.length / workers.length;
    return Promise.all(workers.map((worker, index) => {
      const start = index * elementsPerWorker;
      const promise = Workers.doWork(worker, data.slice(start, start+elementsPerWorker), data);
      worker.promise = promise;
      return promise;
    }));
  }
};

export default Workers;