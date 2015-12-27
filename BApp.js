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
    // var a = require('./image/iconfont-saoma.png');
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", Home._onPressButton);
    this.setState({
      initialRoute: {
        title: '主页',
        component: Home,
        rightButtonIcon: require('./image/iconfont-saoma.png'),
        // onRightButtonPress: Home._onPressButton.bind(this),
        passProps: {
          doubanBookJsonStr: this.state.doubanBookJsonStr,
          duokanBookJsonStr: this.state.duokanBookJsonStr,
          shitiBookJsonStr: this.state.shitiBookJsonStr,
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
    console.log("JSON.stringify(emptyJson)", JSON.stringify(emptyJson))

    return JSON.stringify(emptyJson);
  },

  _dkcallback : function(contents){
    console.log("_dkcallback");
    this.setState({duokanBookJsonStr: contents != null ? contents: this._getEmptyBookJson()});
    this._tryGotoHome();
  },

  _dbcallback: function(contents){
    console.log("_dbcallback", contents != null);
    // console.log(this.state.doubanBookJsonStr)
    this.setState({doubanBookJsonStr: contents != null ? contents: this._getEmptyBookJson()});
    this._tryGotoHome()
    // console.log(this.state.doubanBookJsonStr)
  },

  _stcallback: function(contents){
    console.log("_stcallback");
    this.setState({shitiBookJsonStr:  contents != null ? contents: this._getEmptyBookJson()});
    this._tryGotoHome();
  },

  _tryGotoHome: function()
  {
    if(this._isAllReadDone())
      this._gotoHome();
  },

  _isAllReadDone: function()
  {
    console.log(this.state.duokanBookJsonStr != null)
    console.log(this.state.doubanBookJsonStr != null)
    console.log(this.state.shitiBookJsonStr != null)
    console.log(this.state.duokanBookJsonStr != null
          && this.state.doubanBookJsonStr != null
          && this.state.shitiBookJsonStr != null);
    return this.state.duokanBookJsonStr != null
          && this.state.doubanBookJsonStr != null
          && this.state.shitiBookJsonStr != null;
  },

  getInitialState: function() {

    var initialRoute = {
      title: '主页',
      component: Home,
    };

    // 读取本地数据
    Common.ReadFile(Common.DUOKAN_BOOKS_JSON_NAME, this._dkcallback);
    Common.ReadFile(Common.DOUBAN_BOOKS_JSON_NAME, this._dbcallback);
    Common.ReadFile(Common.SHITI_BOOKS_JSON_NAME, this._stcallback);

    return {
        initialRoute: initialRoute,
        splashed: false,
        doubanBookJsonStr: null,
        duokanBookJsonStr: null,
        shitiBookJsonStr: null,
    };

  },

  componentDidMount: function() {
    this.setTimeout(
      () => {
        this.setState({splashed: true});
      },
      100,
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
