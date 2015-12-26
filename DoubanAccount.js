
var React = require('react-native');
var md5 = require('md5');

var RNFS = require('react-native-fs');

var Common = require('./Common');

var {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ToolbarAndroid,
    ToastAndroid,
    ListView,
    Image,
    DrawerLayoutAndroid,
    TextInput,
    TouchableHighlight,
    AsyncStorage,
    WebView,
} = React;

var BGWASH = 'rgba(255,255,255,0.8)';
var WEBVIEW_REF = 'webview';
var REQUEST_URL_START = "http://read.douban.com/people/";
var REQUEST_URL_END = "/library?start=";
var REQUEST_ID_URL = "http://read.douban.com/";
var LOGIN_URL = "https://accounts.douban.com/login";

var LOGINED_URL1 = "http://m.douban.com";
var LOGINED_URL2 = "http://read.douban.com/account/setting";
var LOGINED_URL3 = "http://www.douban.com/";

var DoubanAccount = React.createClass({

  getInitialState: function() {
    return {
      url: LOGIN_URL,
      bookJson: {},
      id: "",
      count: 10,
    };
  },

  onShouldStartLoadWithRequest: function(event) {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  },

  parseBooks: function(response){
    var html = response._bodyInit;

    var titleRe = /\<div class="title"\><a href=[^\>]+>([^\<]+)<\/a>/g;
    var imgRe = /\<img width="110px" height="164px" src="([^"]+)"/g;
    var allAuthorRe = /<p class=""><span class="labeled-text">(.*?)<\/span>/g;
    var authorRe = /<a class="author-item"[^>]+>([^\<]+)<\/a>/g;
    var countRe = /<span class="total-number">([\d]+)<\/span>/g;

    var count = 10;

    var bookArr = new Array();

    var myArray;

    myArray = countRe.exec(html);
    count = parseInt(myArray[1]);
    this.setState({count:count});

    while(myArray = titleRe.exec(html)){
        // console.log(myArray[1]);
        var book = {
          cover: "",
          title: "",
          authors: "",
        }
        book.title = myArray[1];
        bookArr.push(book);
    }

    var i = 0;
    while(myArray = allAuthorRe.exec(html)){
        // console.log(myArray[1]);
        var authorArr;
        var author = "";
        while(authorArr = authorRe.exec(myArray[1]))
        {
          author += authorArr[1] + " ";
        }
        bookArr[i].authors = author;
        i++;
    }

    var i = 0;
    while(myArray = imgRe.exec(html)){
        // console.log(myArray[1]);
        bookArr[i].cover = myArray[1];
        i++;
    }

    var bookJson = this.state.bookJson;
    bookJson.count = count;
    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",count);
    if(bookJson.items == undefined){
      bookJson.items = bookArr;
    }
    else{
      bookJson.items = bookJson.items.concat(bookArr);
    }
    this.setState({bookJson: bookJson});

    console.log("bookJson.items.length", bookJson.items.length);

    if(bookJson.items.length === count)
    {
      console.log("save");
      this._saveFile(bookJson);
    }
  },

  _saveFile: function()
  {
    var bookJsonStr = JSON.stringify(this.state.bookJson);
    console.log("bookJsonStr",bookJsonStr);

    var path = RNFS.DocumentDirectoryPath + '/' + Common.DOUBAN_BOOKS_JSON_NAME;

    // write the file
    RNFS.writeFile(path, bookJsonStr, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
        this.props.navigator.pop();
      })
      .catch((err) => {
        console.log(err.message);
      });

  },

  _getBooks: function(id)
  {
    var start = 0;

    this.setState({bookJson: {}});
    var count = this.state.count;
    for(var i = 0; i < count; i+=10)
    {
      fetch(REQUEST_URL_START + id + REQUEST_URL_END + i,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:39.0) Gecko/20100101 Firefox/39.0',
        }})
        .then((response) => this.parseBooks(response))
        .then((responseData) => {
          count = this.state.count;
          console.log("jhfjjahewjfjalkjfklj",count);
        })
        .done();
    }

  },

  parseResponse: function(response)
  {
    var html = response._bodyInit;

    var re = /\<a href="\/people\/([\d]+)\/" title="账户" class="bn-more-hoverable"\>/;
    var myArray = re.exec(html);
    console.log("id", myArray[1]);
    this.setState({id: myArray[1]});
    this._getBooks(myArray[1]);
    return;
  },

  onNavigationStateChange: function(navState) {
    var url = navState.url.toString();
    console.log("url", url);
    var prefix = LOGIN_URL;

    // has logined
    if(url.slice(0, LOGINED_URL1.length) == LOGINED_URL1 ||
        url.slice(0, LOGINED_URL2.length) == LOGINED_URL2 ||
        url.slice(0, LOGINED_URL3.length) == LOGINED_URL3 ){
      fetch(REQUEST_ID_URL,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:39.0) Gecko/20100101 Firefox/39.0',
        }})
        .then((response) => this.parseResponse(response))
        .then((responseData) => {
        })
        .done();
    }
  },

  render: function () {
    return (
      <View style={styles.container}>
        <WebView
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          onNavigationStateChange={this.onNavigationStateChange}
          style={styles.webView}
          url={this.state.url}
          automaticallyAdjustContentInsets = {false}
          startInLoadingState={true}
          scrollEnabled={true}
          scalesPageToFit={true}
        />
      </View>
      );
    }
});

var styles = StyleSheet.create({
    container: {
      marginTop: 64,
      justifyContent: 'center',
      backgroundColor: '#F5FCFF',
    },

    textInput:{
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
    },

    button: {
      height: 36,
      width: 40,
      backgroundColor: '#48BBEC',
      borderColor: '#48BBEC',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      justifyContent: 'center'
    },

    webView: {
      flex: 1,
      backgroundColor: 'gray',
      height: 600,
    },
});


module.exports = DoubanAccount;
