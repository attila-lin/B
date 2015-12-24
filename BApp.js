'use strict';

var React = require('react-native');

var TimerMixin = require('react-timer-mixin');

var {
  AppRegistry,
  StyleSheet,
  BackAndroid,
  Navigator,
  ToolBarAndroid,
  Text,
  View,
} = React;

// var HomeScreen = require('./HomeScreen');
var SaveAccount = require('./SaveAccount');
var Result = require('./Result');
var BarCode = require('./BarCode');


var RouteMapper = function(route, navigationOperations, onComponentRef){
  navigator = navigationOperations;
  console.log("nani?");
  if(route.name === 'home'){
    console.log("home");
    return <SaveAccount navigator={navigationOperations} />;
  }
  else if(route.name === 'result')
  {
    console.log("result");
    return <Result navigator={navigationOperations} />;
  }
  else if(route.name === 'barcode')
  {
    console.log("barcode");
    return <BarCode navigator={navigationOperations} />;
  }
  // else if(route.name === 'account'){
  //   return <DetailScreen
  //             navigator={navigationOperations}
  //             movie={route.movie}
  //             title={route.title}/>
  // }
};


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
    var initialRoute = {name: 'home'};

    if(this.state.splashed){
      console.log("heheh");
      // return ( < SaveAccount /> );

      return (
       <Navigator
          // style = {styles.container}
          initialRoute = {initialRoute}
          configureScreen = {(route) => Navigator.SceneConfigs.FloatFromRight}
          renderScene={RouteMapper} />
      );

      // return ( < HomeScreen > );
      // return (
      //   <View style={styles.container}>
      //     <Text style={styles.welcome}>hahahahha </Text>
      //   </View>
      // );
    }
    else{
      console.log("hahah~~~~~~~~");
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>图书管理</Text>
        </View>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b250e',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

module.exports = BApp;
