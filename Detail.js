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
  TouchableHighlight,
  Image,
  AlertIOS,
} = React;

var Detail = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function() {
    if(!this.props.isbn)
      return null;

      console.log('https://api.douban.com/v2/book/isbn/' + this.props.isbn);

      fetch('https://api.douban.com/v2/book/isbn/' + this.props.isbn, {
        method: 'GET',
        dataType: 'json',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then((response) => this.setState({bookjson:JSON.parse(response._bodyText)}))
      .done();

      return {
         bookjson: "",
      };
  },

  componentDidMount: function() {
    this.setTimeout(
      () => {
      },
      2000,
    );
  },


  _onPressButton: function() {
    console.log(this.state.bookjson);
    console.log(typeof this.state.bookjson);

    console.log(this.state.bookjson.image);
    // AlertIOS.alert(
    //   'Bar Button Action',
    //   'Recognized a tap on the bar button icon',
    //   [
    //     {
    //       text: "hehe",
    //       onPress: () => console.log('Tapped OK'),
    //     },
    //   ]
    // );


  },

  render: function() {

    // console.log("???",this.state.bookjson);

    if(this.state.bookjson != ""){
      console.log("hheheheh");
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>{this.state.bookjson.title}</Text>
            <Image
              style={styles.logo}
              source = {{uri:this.state.bookjson.images.large}}
              />

          <TouchableHighlight onPress={this._onPressButton}>
            <Image
              style={styles.button}
            />
          </TouchableHighlight>

        </View>
      );
    }
    else {
      console.log("~~~~");
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>书的内容</Text>
          <TouchableHighlight onPress={this._onPressButton}>
            <Image
              style={styles.button}
            />
          </TouchableHighlight>

        </View>
      )
    }
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 64,
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    height: 36,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  logo: {
    width: 288,
    height: 462,
  }
});

module.exports = Detail;
