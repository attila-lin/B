'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  BackAndroid,
  Navigator,
  ToolBarAndroid,
  Text,
  View,
  TouchableHighlight,
  Image,
} = React;
var BarCode = require("./BarCode");

var Result = React.createClass({

  // fetchData: function() {
  //   fetch(REQUEST_URL)
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       this.setState({
  //         dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
  //         loaded: true,
  //       });
  //     })
  //     .done();
  // },

  _onPressButton: function() {
    this.props.navigator.push({
        title: '扫描条形码',
        component: BarCode,
    });
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>搜到n本书</Text>
        <TouchableHighlight onPress={this._onPressButton}>
          <Image
            style={styles.button}
          />
        </TouchableHighlight>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 64,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});

module.exports = Result;
