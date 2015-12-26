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
  ListView,
} = React;
var BarCode = require("./BarCode");

var REQUEST_URL = "http://www.duokan.com/store/v0/payment/book/list"

var Result = React.createClass({


  getInitialState: function() {
    // console.log("gggggggggggggggggggggggggg",this.props.bookJson);
    if(!this.props.bookJson)
      return null;

    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    var items = this.props.bookJson.items;

    var itemsArray = [];
    for(var x in items){
      itemsArray.push(items[x]);
    }
    // var itemsArray = Object.keys(items).map(function(k) { return items[k] });

    // console.log("heheheheheheheheheh", itemsArray);
    dataSource = dataSource.cloneWithRows(itemsArray);
    console.log(dataSource);
    return {
       bookJson: this.props.bookJson,
       dataSource: dataSource,
    };
  },

  _onPressButton: function() {
    this.props.navigator.push({
        title: '扫描条形码',
        component: BarCode,
    });
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>搜到{this.state.bookJson.count}本书</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderBook}
          style={styles.listView}
        />
        <TouchableHighlight onPress={this._onPressButton}>
          <Image
            style={styles.button}
          />
        </TouchableHighlight>

      </View>
    );
  },

  renderBook: function(book) {
    console.log(book);
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

module.exports = Result;
