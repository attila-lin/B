'use strict';

var React = require('react-native');
var RNFS = require('react-native-fs');

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
var TimerMixin = require('react-timer-mixin');

var icloud = require('react-native-icloud-sync');
var SearchBar = require('react-native-search-bar');

var Swipeout = require('react-native-swipeout');

var swipeoutBtns = [
  {
    text: '删除'
  }
];

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
    // TODO 没有更新
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    // this.props.navigator.replace({
    //   title: '主页',
    //   component: Home,
    //   rightButtonIcon: require('./image/iconfont-saoma.png'),
    //   onRightButtonPress: this._onPressButton,
    //   passProps: {
    //     doubanBookJsonStr: this.state.doubanBookJsonStr,
    //     duokanBookJsonStr: this.state.duokanBookJsonStr,
    //     shitiBookJsonStr: this.state.shitiBookJsonStr,
    //   },
    // });

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
        <Text style={{textAlign: 'center'}}>
          Loading...
        </Text>
      </View>
    );
  },
  // onChangeText={}
  // onSearchButtonPress={}
  // onCancelButtonPress={}
  render: function() {
    console.log("render",this.state.loading);
    if(this.state.loading){
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        <SearchBar
        	ref='searchBar'
        	placeholder='Search'

      	/>
        <View style={styles.textContainer}>
          <Text style={styles.welcome}>你共拥有{this.state.allBook.count}本书</Text>
          <Text style={styles.Commit}>其中多看阅读中{this.state.dkJson.count}本书</Text>
          <Text style={styles.Commit}>其中豆瓣阅读中{this.state.dbJson.count}本书</Text>
          <Text style={styles.Commit}>其中实体书中{this.state.stJson.count}本书</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderBook}
          style={styles.listView}
        />
        <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={this._onPressButton}>
            <Image style={styles.button}>
              <Text style={styles.buttonText}>扫码</Text>
            </Image>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onLoginDuokan}>
            <Image style={styles.button}>
              <Text style={styles.buttonText}>登录多看</Text>
            </Image>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onLoginDouban}>
            <Image style={styles.button}>
              <Text style={styles.buttonText}>登录豆瓣</Text>
            </Image>
          </TouchableHighlight>
        </View>

      </View>
    );
  },

  renderBook: function(book) {
    return (
      <Swipeout right={swipeoutBtns}>
        <View style={styles.listContainer}>
          <View style={styles.coverContainer}>
            <Image
              source={{uri: book.cover}}
              style={styles.cover}
            />
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.authors}</Text>
          </View>
        </View>
      </Swipeout>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 64,
  },
  textContainer: {
    backgroundColor: '#edeff6',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eaecea',
    borderBottomWidth: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
  Commit: {
    fontSize: 10,
    textAlign: 'center',
    margin: 2,
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
  listView: {
    backgroundColor: 'white',
  },
  cover: {
    width: 50,
    height: 75,
  },
  title: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'left',
    color: '#002B36',
  },
  author: {
    fontSize: 10,
    marginBottom: 8,
    textAlign: 'left',
    color: '#a5a7a7',
  },
  rightContainer: {
    flex: 1,
    marginLeft:8,
  },
  coverContainer: {
    // flex: 1,
    margin: 8,
    // marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 50,
    margin: 8,
    backgroundColor: 'transparent',
    flex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 10,
    textAlign: 'center',
    margin: 2,
  },

});

module.exports = Home;
