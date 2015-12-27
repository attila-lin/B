'use strict';

var React = require('react-native');
var RNFS = require('react-native-fs');

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
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
  ListView,
  AsyncStorage,
} = React;

var REQUEST_URL = "http://www.duokan.com/store/v0/payment/book/list";

var Common = require('./Common');

var Home = React.createClass({
  mixins: [TimerMixin],

  _updateAllBook: function()
  {
    var allBook = Common.getEmptyBookJson();
    allBook.count = this.state.dbJson.count + this.state.dkJson.count + this.state.stJson.count;
    allBook.items = this.state.dbJson.items.concat(this.state.dkJson.items).concat(this.state.stJson.count);
    this.setState({allBook:allBook});
  },

  componentWillMount: function()
  {
    console.log("componentWillMount");
    this.eventEmitter = new EventEmitter();
  },

  componentDidMount: function()
  {
    console.log("componentDidMount");
    // this.addListenerOn(this.props.events, 'addOneNewBook', this._update);
    this.eventEmitter.addListener('addOneNewBook', this._addOneNewBook);
    this.eventEmitter.addListener('updateDoubanBooks', this._updateDoubanBooks);
    this.eventEmitter.addListener('updateDuokanBooks', this._updateDuokanBooks);

    this.setTimeout(
      () => {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        this.loadData();
        this.setState({loading: false});
      },
      1000,
    );
  },

  loadData: function()
  {
    var stJson;
    if(this.props.shitiBookJsonStr === undefined)
      stJson = Common.getEmptyBookJson();
    else{
      stJson = JSON.parse(this.props.shitiBookJsonStr);
    }
    this.setState({stJson:stJson});

    var dbJson;
    if(this.props.doubanBookJsonStr === undefined)
      dbJson = Common.getEmptyBookJson();
    else{
      dbJson = JSON.parse(this.props.doubanBookJsonStr);
    }
    this.setState({dbJson:dbJson});

    var dkJson;
    if(this.props.doubanBookJsonStr === undefined)
      dkJson = Common.getEmptyBookJson();
    else{
      dkJson = JSON.parse(this.props.duokanBookJsonStr);
    }
    this.setState({dkJson:dkJson});

    this._updateAllBook();

    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    var items = this.state.allBook.items;

    var itemsArray = [];
    for(var x in items){
      itemsArray.push(items[x]);
    }

    dataSource = dataSource.cloneWithRows(itemsArray);
    this.setState({dataSource:dataSource});
  },

  _addOneNewBook: function(args)
  {
    console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", args);

    var stJson = this.state.stJson;
    stJson.count += 1;
    stJson.items.push(args.newBook);
    this.setState({stJson: stJson});

    var path = RNFS.DocumentDirectoryPath + '/' + Common.SHITI_BOOKS_JSON_NAME;

    // write the file
    RNFS.writeFile(path, JSON.stringify(this.state.stJson), 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  _updateDoubanBooks: function(args)
  {
    console.log("_updateDoubanBooks", args.dbJson.count);
    this.setState({dbJson:args.dbJson});
  },

  _updateDuokanBooks: function(args)
  {
    console.log("_updateDuokanBooks", args.dkJson.count);
    this.setState({dkJson:args.dkJson});
  },

  componentWillReceiveProps: function (nextProps) {
    // body...
    // console.log("componentWillReceiveProps", nextProps);
  },

  shouldComponentUpdate: function(nextProps, nextState)
  {
    return true;
  },

  componentDidUpdate: function(prevProps, prevState)
  {
      console.log("componentDidUpdate");
  },

  getInitialState: function() {
    return({
        allBook: Common.getEmptyBookJson(),
        dbJson: Common.getEmptyBookJson(),
        dkJson: Common.getEmptyBookJson(),
        stJson: Common.getEmptyBookJson(),
        dataSource: null,
        loading: true,
      });
  },

  _onPressButton: function() {
    var BarCode = require('./BarCode');
    console.log("BarCode", BarCode);
    this.props.navigator.push({
      title: '扫描条形码',
      component: BarCode,
      passProps: {
          events: this.eventEmitter
      }
      // leftButtonTitle:"主页",
      // onLeftButtonPress: () => console.log("hehhe") ,
    });
  },

  _onLoginDuokan: function() {
    var DuokanAccount = require('./DuokanAccount');
    this.props.navigator.push({
      title: '',
      component: DuokanAccount,
      passProps: {
          events: this.eventEmitter
      }
    });
  },

  _onLoginDouban: function() {
    var DoubanAccount = require('./DoubanAccount');
    this.props.navigator.push({
      title: '登陆账号',
      component: DoubanAccount,
      passProps: {
          events: this.eventEmitter
      }
    });
  },



  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  },

  render: function() {
    console.log("render",this.state.loading);
    if(this.state.loading){
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>你共拥有{this.state.allBook.count}本书</Text>
        <Text style={styles.welcome}>其中多看阅读中{this.state.dkJson.count}本书</Text>
        <Text style={styles.welcome}>其中豆瓣阅读中{this.state.dbJson.count}本书</Text>
        <Text style={styles.welcome}>其中实体书中{this.state.stJson.count}本书</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderBook}
          style={styles.listView}
        />
        <TouchableHighlight onPress={this._onPressButton}>
          <Image style={styles.button}>
            <Text>扫码</Text>
          </Image>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._onLoginDuokan}>
          <Image style={styles.button}>
            <Text>登录多看</Text>
          </Image>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._onLoginDouban}>
          <Image style={styles.button}>
            <Text>登录豆瓣</Text>
          </Image>
        </TouchableHighlight>

      </View>
    );
  },

  renderBook: function(book) {
    return (
      <View style={styles.listContainer}>
        <Image
          source={{uri: book.cover}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.title}>{book.authors}</Text>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 64,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    height: 20,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    width: 80,
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  rightContainer: {
    flex: 1,
  },

});

module.exports = Home;
