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

 export default Workers;