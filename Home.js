'use strict';

// import SaveAccount from './SaveAccount';
// import BarCode from './BarCode';

var React = require('react-native');
var RNFS = require('react-native-fs');

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

  _getAllBooks: function(dbJson, dkJson, stJson)
  {
    var allBook = {
      count: 0,
      items: [],
    };
    allBook.count = dbJson.count + dkJson.count + stJson.count;
    allBook.items = dbJson.items.concat(dkJson.items).concat(stJson.count);
    return allBook;
  },

  getInitialState: function() {

    //console.log("this.props.doubanBookJsonStr", this.props.doubanBookJsonStr);
    //console.log("this.props.duokanBookJsonStr", this.props.duokanBookJsonStr);
    //console.log("this.props.shitiBookJsonStr", this.props.shitiBookJsonStr);

    var stJson;
    if(this.props.shitiBookJsonStr === undefined)
      stJson = {
        count: 0,
        items: [],
      };
    else{
      stJson = JSON.parse(this.props.shitiBookJsonStr);
    }

    var dbJson;
    if(this.props.doubanBookJsonStr === undefined)
      dbJson = {
        count: 0,
        items: [],
      };
    else{
      dbJson = JSON.parse(this.props.doubanBookJsonStr);
    }

    var dkJson;
    if(this.props.doubanBookJsonStr === undefined)
      dkJson = {
        count: 0,
        items: [],
      };
    else{
      dkJson = JSON.parse(this.props.duokanBookJsonStr);
    }

    var allBook = this._getAllBooks(dbJson, dkJson, stJson);

    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    var items = allBook.items;

    var itemsArray = [];
    for(var x in items){
      itemsArray.push(items[x]);
    }

    dataSource = dataSource.cloneWithRows(itemsArray);

    return({
      allBook: allBook,
      dbJson: dbJson,
      dkJson: dkJson,
      stJson: stJson,
      dataSource: dataSource,
      loading: false,
    });
  },

  _onPressButton: function() {
    var BarCode = require('./BarCode');
    console.log("BarCode", BarCode);
    this.props.navigator.push({
      title: '扫描条形码',
      component: BarCode,
      // leftButtonTitle:"主页",
      // onLeftButtonPress: () => console.log("hehhe") ,
    });
  },

  _onLoginDuokan: function() {
    var DuokanAccount = require('./DuokanAccount');
    this.props.navigator.push({
      title: '',
      component: DuokanAccount,
    });
  },

  _onLoginDouban: function() {
    var DoubanAccount = require('./DoubanAccount');
    this.props.navigator.push({
      title: '登陆账号',
      component: DoubanAccount,
    });
  },



  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
        <LoginDoukanBtn />
      </View>
    );
  },

  render: function() {
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
