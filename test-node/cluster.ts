import http from 'http';
import { cpus } from 'os';
import cluster from 'cluster';
console.log(cpus().length);
if (cluster.isPrimary) {
  const length = cpus().length;
  console.log('cpu cores length', length);
  for (let i = 0; i < length; i++) {
    cluster.fork();
  }
  cluster.on('exit', work => {
    console.log(`Work process ${work.process.pid} died`);
  });
} else {
  http.createServer((req, res) => {
    console.log(req);
    res.writeHead(200);
    res.end('sjfslfjsdlfjsdlfj');
  }).listen(8000);
  console.log(`worker ${process.pid} start`);
}
