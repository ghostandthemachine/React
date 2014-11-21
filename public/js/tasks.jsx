/**
 * @jsx React.DOM
 */
(function(window, React) {

  var Task = React.createClass({
    // Not needed always but can be really helpful
    // The isRequired below means that if a Task component isn't given a valid object in the task property it will error
    propTypes: {
      task: React.PropTypes.object.isRequired
    },

    render: function() {

      // Unlike the Tasks component which calls to the API to update the tasks state, the Task object is given the Task on creation to it is a property and not in the Task state. We access this through this.props like below

      var task = this.props.task;
      return (
        <div className="task-container">
          <p className="task-id">{ task._id }</p>
          <p>Name</p>
          <input className="task-name" defaultValue={ task.name }/>
          <p>Description</p>
          <input className="task-description" defaultValue={ task.description }/>
          <p>Completed</p>
          <input type="checkbox" checked={ task.completed } onClick={ this.props.completeTask } />
          <br/>
          <button onClick={ this.props.deleteTask }>Delete</button>
          <br/>
          <br/>
        </div>
      )
    }
  });

  window.Tasks = React.createClass({

    getInitialState: function() {
      return {
        tasks: []
      }
    },

    componentDidMount: function () {
      // Our API uses jQuery promises. These are functions which you attach handlers to, like below.
      window.TODO_API.all_tasks().done(function(response) {
        // Here we check to make sure the API called returned successfully 
        if(response.status === 'success') {
          // Iff successful, set this component's state value for the todos to use in the render method
          this.setState({tasks: response.data});
        }
      }.bind(this));
    },

    completeTask: function(task) {
      // Toggle the given task's completed state
      task.completed = !task.completed;

      var tasks = this.state.tasks;
      // update this task in the component state to be compeleted
      tasks = tasks.map(function(t) {
        // replace the old record of this task with the new one that is updated
        return task._id == t._id ? task : t;
      });
      // Now update the state with the newly updated tasks array
      this.setState({tasks: tasks});

      window.TODO_API.update_task(task).fail(function(resp) {
        // We already updated the state so we really only need to worry about an err if it happens on the update
        console.log("Error updating task");
        console.log(resp.message);
      });
    },

    deleteTask: function(task) {
      if(confirm("Are you sure you want to delete this task?")) {
        var tasks = this.state.tasks;
        tasks = tasks.filter(function(t) {
          // return false for the given task to delete, otherwise true to keep the other tasks
          return task._id != t._id;
        });
        // Now update the state with the newly updated tasks array
        this.setState({tasks: tasks});

        window.TODO_API.delete_task(task).fail(function(resp) {
          // We already updated the state so we really only need to worry about an err if it happens on the update
          console.log("Error deleting task");
          console.log(resp.message);
        });
      }
    },

    createTask: function() {
      window.TODO_API.create_task().done(function(resp) {
        if(resp.status == 'success') {
          // given the new task, add it to the state
          var tasks = this.state.tasks;
          tasks.push(resp.data);
          this.setState({tasks: tasks});
        }
      }.bind(this));
    },

    // You can see the JSX syntax below where you have to wrap the JS code which is embedded in HTML in {}
    // NOTES:
    // - You can't use if/else statements but you can use ternary ops ( something_truthy ? 'true val' : 'false val' ) etc
    // - You can see below how you can map over your state data and return additional components
    render: function() {
      return (
        <div className="tasks-container">
          <h3>Tasks</h3>
          {
            this.state.tasks.map(function(task) {
              return (
                <Task task={ task } deleteTask={ this.deleteTask.bind(null, task) } completeTask={ this.completeTask.bind(null, task) } />
              )
            }.bind(this))
          }
          <br/>
          <button onClick={ this.createTask }>Create Task</button>
        </div>
      )
    }
  });

})(window, React);
