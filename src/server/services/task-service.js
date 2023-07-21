import { v4 as uuidv4 } from "uuid";

const tasks = [];

const createTask = (call, cb) => {
  const task = call.request;
  console.log(`Creating task ${JSON.stringify(task)}.`);
  const transactionId = uuidv4();
  tasks.push({ ...task, jiraId: transactionId });

  cb(null, {
    transactionId,
  });
};

const getTasks = (call) => {
  const totalNumbers = tasks.length;
  const delayMs = 1000;
  let currentNumber = 0;

  const interval = setInterval(() => {
    if (currentNumber >= totalNumbers) {
      clearInterval(interval);
      call.end();
    } else {
      call.write(tasks[currentNumber]);
      currentNumber++;
    }
  }, delayMs);
};

const streamCreateTask = (call, cb) => {
  const transactionIds = [];

  call.on("data", (task) => {
    console.log(`Stream: Creating task ${JSON.stringify(task)}.`);
    const transactionId = uuidv4();
    transactionIds.push(transactionId);
    tasks.push({ ...task, jiraId: transactionId });
  });

  call.on("end", () => {
    cb(null, {
      transactionIds: transactionIds,
    });
  });
};

const streamContinuesTaskCreation = (call) => {
  call.on("data", (task) => {
    console.log(`Stream: Creating task ${JSON.stringify(task)}.`);
    const transactionId = uuidv4();
    const persistedTask = { ...task, jiraId: transactionId };
    tasks.push(persistedTask);
    call.write({ transactionId });
  });

  call.on("end", () => {
    call.end();
  });
};

export default {
  createTask,
  getTasks,
  streamCreateTask,
  streamContinuesTaskCreation,
};
