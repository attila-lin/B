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


var Home = React.createClass({
  getInitialState: function() {

    // console.log(this.props.bookJson);

    var bookJson = JSON.parse(this.props.bookJson);

    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    var items = bookJson.items;

    var itemsArray = [];
    for(var x in items){
      itemsArray.push(items[x]);
    }

    dataSource = dataSource.cloneWithRows(itemsArray);

    return({
      bookJson: bookJson,
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
    });
  },

  _onLoginDuokan: function() {
    var SaveAccount = require('./SaveAccount');
    this.props.navigator.push({
      title: '登陆账号',
      component: SaveAccount,
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
        <Text style={styles.welcome}>搜到{this.state.bookJson.count}本书</Text>
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
  listView: {
    paddingTop: 20,
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
