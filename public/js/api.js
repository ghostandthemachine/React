var client = new $.RestClient('/api/');

client.add('tasks');

var TEST_TASKS = [
  {
    _id: 0,
    name: "First Task Bitches",
    description: "Get this shit done",
    completed: false
  },
  {
    _id: 1,
    name: "Second Task Bitches",
    description: "Get this other shit done",
    completed: true
  },
  {
    _id: 2,
    name: "Third Task Bitches",
    description: "Get this other shit done",
    completed: false
  }
];


window.TODO_API = {

  all_tasks: function() {
    // return client.tasks.read();  // what should be returned when there is a DB behind this API
    // TMP code to mess with React components in the meantime
    // jQuery Rest, a nice little API management lib (https://github.com/jpillora/jquery.rest) returns promises so for now will simulate that
    var dfd = new jQuery.Deferred();

    dfd.resolve({
      status: 'success',
      message: 'got all tasks',
      data: TEST_TASKS
    });
    return dfd.promise();
  },

  update_task: function(task) {
    var dfd = new jQuery.Deferred();
    dfd.resolve({
      status: 'success',
      message: 'Updated task',
      data: task
    });
    return dfd.promise();
  },

  delete_task: function(task) {
    var dfd = new jQuery.Deferred();
    dfd.resolve({
      status: 'success',
      message: 'Deleted task'
    });
    return dfd.promise();
  },

  create_task: function() {
    var task = {
      _id: TEST_TASKS.length,
      name: "",
      description: "",
      completed: false
    }
    var dfd = new jQuery.Deferred();
    dfd.resolve({
      status: 'success',
      message: 'Deleted task',
      data: task
    });
    return dfd.promise();
  }


};






