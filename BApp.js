'use strict';

var React = require('react-native');
var RNFS = require('react-native-fs');

var Home = require('./Home');

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


var Common = require('./Common');

var BApp = React.createClass({
  mixins: [TimerMixin],

  _gotoHome: function()
  {
    this.setState({
      initialRoute: {
        title: '主页',
        component: Home,
        passProps: {
          doubanBookJsonStr: this.state.doubanBookJsonStr,
          duokanBookJsonStr: this.state.duokanBookJsonStr,
        },
      },
    });
  },

  _getEmptyBookJson:function()
  {
    var emptyJson = {
      count: 0,
      items: [],
    };

    return JSON.stringify(emptyJson);
  },

  _dkcallback : function(contents){
    console.log("_dkcallback");
    if(contents == null)
      this.setState({duokanBookJsonStr: _getEmptyBookJson()});
    this.setState({duokanBookJsonStr: contents});

    if(this.state.doubanBookJsonStr != null)
      this._gotoHome();
  },

  _dbcallback: function(contents){
    if(contents == null)
      this.setState({doubanBookJsonStr: _getEmptyBookJson()});
    this.setState({doubanBookJsonStr: contents});

    if(this.state.duokanBookJsonStr != null)
      this._gotoHome();
  },

  getInitialState: function() {

    var initialRoute = {
      title: '主页',
      component: Home,
    };

    Common.ReadFile(Common.DUOKAN_BOOKS_JSON_NAME, this._dkcallback);
    Common.ReadFile(Common.DOUBAN_BOOKS_JSON_NAME, this._dbcallback);

    return {
        initialRoute: initialRoute,
        splashed: false,
        doubanBookJsonStr: null,
        duokanBookJsonStr: null,
    };

  },

  componentDidMount: function() {
    this.setTimeout(
      () => {
        this.setState({splashed: true});
      },
      2000,
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
