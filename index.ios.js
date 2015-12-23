/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
} = React;

var BApp = require('./BApp');

var B = React.createClass({
  render: function() {
    return (
      <BApp />
    );
  }
});

AppRegistry.registerComponent('B', () => B);
