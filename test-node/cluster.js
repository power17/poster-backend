"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const os_1 = require("os");
const cluster_1 = __importDefault(require("cluster"));
console.log((0, os_1.cpus)().length);
if (cluster_1.default.isPrimary) {
    const length = (0, os_1.cpus)().length;
    console.log('cpu cores length', length);
    for (let i = 0; i < length; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', work => {
        console.log(`Work process ${work.process.pid} died`);
    });
}
else {
    http_1.default.createServer((req, res) => {
        console.log(req);
        res.writeHead(200);
        res.end('sjfslfjsdlfjsdlfj');
    }).listen(8000);
    console.log(`worker ${process.pid} start`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsMkJBQTBCO0FBQzFCLHNEQUE4QjtBQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUEsU0FBSSxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxpQkFBTyxDQUFDLFNBQVMsRUFBRTtJQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFBLFNBQUksR0FBRSxDQUFDLE1BQU0sQ0FBQztJQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0IsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNoQjtJQUNELGlCQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7Q0FDSjtLQUFNO0lBQ0wsY0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7Q0FDNUMifQ==