import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import taskService from "./services/index.js";

const main = () => {
  const protoPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../proto/task.proto"
  );

  const packageDefinition = protoLoader.loadSync(protoPath, {});
  const taskPackage = grpc.loadPackageDefinition(packageDefinition).taskPackage;

  const server = new grpc.Server();

  // proto service mapping implementation.
  server.addService(taskPackage.TaskService.service, {
    createTask: taskService.createTask,
    getTasks: taskService.getTasks,
    streamCreateTask: taskService.streamCreateTask,
    streamContinuesTaskCreation: taskService.streamContinuesTaskCreation
  });

  console.log(taskService);
  server.bindAsync(
    "0.0.0.0:40000",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
};

main();
