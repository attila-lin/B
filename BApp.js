'use strict';

var React = require('react-native');
var RNFS = require('react-native-fs');

var TimerMixin = require('react-timer-mixin');

var {
  AppRegistry,
  StyleSheet,
  BackAndroid,
  NavigatorIOS,
  ToolBarAndroid,
  Text,
  View,
  AsyncStorage,
} = React;


var Home = require('./Home');


var BApp = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function() {

    var initialRoute = {
      title: '登陆账号',
      component: Home,
      // backButtonTitle: 'Custom Back',
    };

    RNFS.readDir(RNFS.DocumentDirectoryPath)
    .then((result) => {
      for (var i = 0; i < result.length; i++) {
        if(result[i].name === "doubanBooks.txt"){
          return Promise.all([RNFS.stat(result[i].path), result[i].path]);
        }
      }
    })
    .then((statResult) => {
      if (statResult[0].isFile()) {
        // if we have a file, read it
        return RNFS.readFile(statResult[1], 'utf8');
      }
      return 'no file';
    })
    .then((contents) => {
      // log the file contents
      console.log("contents", contents);
      this.setState({
        initialRoute: {
          title: '主页',
          component: Home,
          passProps: {bookJson: contents},
        },
      });

    })
    .catch((err) => {
      console.log(err.message, err.code);
    });

    return {
        initialRoute: initialRoute,
        splashed: false,
    };

  },

  componentDidMount: function() {
    this.setTimeout(
      () => {
        this.setState({splashed: true});
      },
      500,
    );
  },

  render: function() {
    if(this.state.splashed){
      return (
       <NavigatorIOS
         style={styles.nav}
         initialRoute = {this.state.initialRoute}
       />
      );
    }
    else{
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>图书管理</Text>
        </View>
      );
    }
  }
});

var styles = StyleSheet.create({
  nav: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b3e22a',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

module.exports = BApp;
