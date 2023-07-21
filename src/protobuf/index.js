const { v4: uuidv4 } = require('uuid');
const jspb = require('google-protobuf');
const Schema = require('./task_pb');
const fs = require('fs');
const path = require('path');


const docTask = new Schema.Task();
docTask.setId("1");
docTask.setDescription("I love documentation.");

const tddTask = new Schema.Task();
tddTask.setId("2");
tddTask.setDescription("I love Test-driven development");

const tasks = new Schema.Tasks();
tasks.addTasks(docTask);
tasks.addTasks(tddTask);

const bytes = tasks.serializeBinary();

fs.writeFileSync(path.join(__dirname, 'tasks'), bytes, {encoding: 'binary'});
console.log(bytes)