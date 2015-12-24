'use strict';

var React = require('react-native');

var TimerMixin = require('react-timer-mixin');

var {
  AppRegistry,
  StyleSheet,
  BackAndroid,
  NavigatorIOS,
  ToolBarAndroid,
  Text,
  View,
} = React;

// var HomeScreen = require('./HomeScreen');
var SaveAccount = require('./SaveAccount');
var Result = require('./Result');
var BarCode = require('./BarCode');
var Detail = require('./Detail');


// var RouteMapper = function(route, navigationOperations, onComponentRef){
//   navigator = navigationOperations;
//   console.log("nani?");
//   if(route.name === 'home'){
//     console.log("home");
//     return <SaveAccount navigator={navigationOperations} />;
//   }
//   else if(route.name === 'result')
//   {
//     console.log("result");
//     return <Result navigator={navigationOperations} />;
//   }
//   else if(route.name === 'barcode')
//   {
//     console.log("barcode");
//     return <BarCode navigator={navigationOperations} />;
//   }
//   else if(route.name === 'detail')
//   {
//     console.log("detail");
//     return <Detail navigator={navigationOperations} />;
//   }
//   // else if(route.name === 'account'){
//   //   return <DetailScreen
//   //             navigator={navigationOperations}
//   //             movie={route.movie}
//   //             title={route.title}/>
//   // }
// };


var BApp = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function() {
     return {
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
    var initialRoute = {
      title: '设置账号',
      component: SaveAccount,
      backButtonTitle: 'Custom Back',
    };

    if(this.state.splashed){
      return (
       <NavigatorIOS
         style={styles.nav}
         initialRoute = {initialRoute}
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
    backgroundColor: '#3cb53a',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

module.exports = BApp;
