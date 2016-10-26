var React = require("react");
var ReactApp = React.createClass({

      componentDidMount: function () {
        console.log(this.props.text);

      },
      render: function() {
        return (<center><h1>{this.props.text}</h1></center>)
      }

  });

module.exports = ReactApp

