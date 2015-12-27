'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');

var EventEmitter = require('EventEmitter');

const { BlurView } = require('react-native-blur');
const { VibrancyView } = require('react-native-blur');


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
// TODO amazon
// http://www.amazon.cn/s/ref=nb_sb_noss?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&url=search-alias%3Daps&field-keywords=9787302162063

var Detail = React.createClass({
  mixins: [TimerMixin],

  componentWillMount: function() {

  },


  getInitialState: function() {
    // console.log("events", this.props.events);
    if(!this.props.isbn)
      return {
         bookjson: "",
      };

      // console.log('https://api.douban.com/v2/book/isbn/' + this.props.isbn);

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
      cover: this.state.bookjson.images.medium,
      authors: this.state.bookjson.author,
    };
    var Home = require("./Home");

    this.props.events.emit('addOneNewBook', { newBook: bookJson });

    // console.log(this.props.route);
    // this.props.navigator.popToRoute(
    //   {
    //       title: '主页',
    //       component: Home,
    //       passProps: {addBook: bookJson},
    //   }
    // );

    this.props.navigator.popN(2);
  },

  // <Image source={{uri:this.state.bookjson.images.large}} style={styles.logo}>
  //     <VibrancyView blurType="light" style={styles.blur}>
  //       <Text>Hi, I am a tiny menu item</Text>
  //     </VibrancyView>
  // </Image>

  render: function() {

    if(this.state.bookjson != ""){
      console.log(this.state.bookjson);
      return (
        <View style={styles.container}>
            <View style={styles.coverContainer}>
              <Image
                style={styles.logo}
                source = {{uri:this.state.bookjson.images.large}}
                />
            </View>
            <Text style={styles.title}>{this.state.bookjson.title}</Text>
            <Text style={styles.author}>{this.state.bookjson.author}/{this.state.bookjson.publisher}/{this.state.bookjson.pubdate}</Text>
          <TouchableHighlight onPress={this._onPressButton}>
            <Image style={styles.button}>
              <Text style={styles.buttonText}>添加到已购</Text>
            </Image>
          </TouchableHighlight>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>loading</Text>
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
  title: {
    fontSize: 20,
    margin: 4,
    marginLeft: 8,
    textAlign: 'left',
    color: '#002B36',
  },
  author: {
    fontSize: 15,
    margin: 4,
    marginLeft: 8,
    textAlign: 'left',
    color: '#a5a7a7',
  },
  button: {
    height: 20,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    width: 80,
  },
  logo: {
    width: 140,
    height: 231,
    alignSelf: 'center',
    // margin: 8,
  },
  blur: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  coverContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    borderBottomColor: '#eaecea',
    borderBottomWidth: 2,
  },
  buttonText: {
    fontSize: 10,
    textAlign: 'center',
    margin: 2,
  },
});

module.exports = Detail;
