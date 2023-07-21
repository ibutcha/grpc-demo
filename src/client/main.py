import threading

import task_pb2 as Schema
import task_pb2_grpc

import grpc


def run():
    with grpc.insecure_channel('localhost:40000') as channel:
        stub = task_pb2_grpc.TaskServiceStub(channel)

        # unary(stub)
        # clientStreaming(stub)
        # serverStreaming(stub)
        bidirectionalStreaming(stub)


def unary(stub):
    response = stub.createTask(Schema.Task(
        id="1", description="Create a lovely documentation."))
    print(f"Unary: Create Task procedure response: {response}")


def clientStreaming(stub):
    tasks = [
        Schema.Task(description="Gather requirements."),
        Schema.Task(description="Analyze requirements."),
        Schema.Task(description="Create design based on requirements."),
        Schema.Task(description="Present the created design to the client."),
        Schema.Task(description="Create an implementation plan."),
        Schema.Task(description="Develop functionalities.."),
        Schema.Task(description="Deploy applications"),
        Schema.Task(description="Celebration with the TEAM, MUST HAVE."),
    ]

    response = stub.streamCreateTask(iter(tasks))
    print(f"ClientStreaming: create task response: {response}")


def serverStreaming(stub):
    responses = stub.getTasks(Schema.NoParameters())
    for response in responses:
        print(f"ServerStreaming: Task: {response}")


def bidirectionalStreaming(stub):
    receive_thread = threading.Thread(target=receive_tasks, args=(
        stub.streamContinuesTaskCreation(iter([])),))
    receive_thread.start()

    tasks = [
        Schema.Task(description="Get a cup of coffee."),
        Schema.Task(description="Enjoy coffee."),
        Schema.Task(description="Open Laptop"),
        Schema.Task(description="Read messages."),
        Schema.Task(description="Read emails"),
        Schema.Task(description="Check calendar."),
        Schema.Task(description="Plan activities"),
        Schema.Task(description="Start actitivities"),
    ]

    responses = stub.streamContinuesTaskCreation(iter(tasks))
    for response in responses:
        print(f"Received message: {response}")

    receive_thread.join()

def receive_tasks(responses):
    for response in responses:
        print(f"Received message: {response}")

if __name__ == '__main__':
    run()