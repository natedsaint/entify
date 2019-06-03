const Workers = {
  globals: {},
  createWorkers(numWorkers=5, src) {
    let workers = new Array(numWorkers);
    for (var i = 0; i < numWorkers; i++) {
      workers[i] = new Worker(src);
    }
    return workers;
  },
  doWork(worker, data, allData) {
    return new Promise(function(resolve, reject) {
      worker.onmessage = resolve;
      worker.onerror = reject;
      worker.postMessage({ chunk: data, allData, globals: JSON.stringify(Workers.globals) });
    });
  },
  doDistributedWork(workers, data) {
    // data size is always a multiple of the number of workers
    var elementsPerWorker = data.length / workers.length;
    return Promise.all(workers.map(function(worker, index) {
      const start = index * elementsPerWorker;
      const promise = Workers.doWork(worker, data.slice(start, start+elementsPerWorker), data);
      worker.promise = promise;
      return promise;
    }));
  }
};

export default Workers;