const { parentPort } = require('worker_threads');

(async () => {
    console.log("Preverite če so vse luči ugasnjene")
    // wait for a promise to finish

    // signal to parent that the job is done
    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
})();