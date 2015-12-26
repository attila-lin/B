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

    var bookJson = {
      title: this.state.bookjson.title,
      cover: this.state.bookjson.medium,
      authors: this.state.bookjson.author,
    };
    var Home = require("./Home");

    console.log(this.props.route);
    // this.props.navigator.popToRoute(
    //   {
    //       title: '主页',
    //       component: Home,
    //       passProps: {addBook: bookJson},
    //   }
    // );

    // this.props.navigator.popN(2);
  },

  render: function() {

    if(this.state.bookjson != ""){
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>{this.state.bookjson.title}</Text>
            <Image
              style={styles.logo}
              source = {{uri:this.state.bookjson.images.medium}}
              />
            <Text style={styles.welcome}>{this.state.bookjson.author}</Text>
          <TouchableHighlight onPress={this._onPressButton}>
            <Image style={styles.button}>
              <Text>添加到已购</Text>
            </Image>
          </TouchableHighlight>
        </View>
      );
    }
    else {
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
    width: 140,
    height: 231,
  }
});

module.exports = Detail;
