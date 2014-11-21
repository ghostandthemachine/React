/**
 * @jsx React.DOM
 */
(function(window, React) {
  var App = React.createClass({displayName: 'App',
    render: function() {
      return (
        <div className="app">
          <h1>TODO React</h1>
          <Tasks/>
        </div>
      );
    }
  });

  React.render(
    React.createElement(App, null),
    document.getElementById('app')
  );
})(window, React);
  