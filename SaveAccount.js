'use strict';

var React = require('react-native');
var md5 = require('md5');

var RNFS = require('react-native-fs');

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
var REQUEST_URL = "http://www.duokan.com/store/v0/payment/book/list"
var GET_URL = "https://account.xiaomi.com/pass/serviceLogin?callback=http%3A%2F%2Flogin.dushu.xiaomi.com%2Fdk_id%2Fapi%2Fcheckin%3Ffollowup%3Dhttp%253A%252F%252Fwww.duokan.com%252Fm%252F%253Fapp_id%253Dweb%26sign%3DNGY2MTUyNTM2NWVmNWQzOTA5NmZlZGYwYzM2NDEzZmM%3D%26device_id%3D&sid=reader&display=mobile";

var SaveAccount = React.createClass({

  getInitialState: function() {
    console.log("SaveAccount");
    return {
      url: GET_URL,
      account: "账号",
      passwd: "密码",
      bookJson: "",
    };
  },

  onShouldStartLoadWithRequest: function(event) {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  },

  parseResponse: function(response)
  {
    this.setState({bookJson : JSON.parse(response._bodyInit)});

    // AsyncStorage.setItem("doubanBooks",this.state.bookJson.toString());
    // create a path you want to write to
    var path = RNFS.DocumentDirectoryPath + '/doubanBooks.txt';

    // write the file
    RNFS.writeFile(path, response._bodyInit, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
        this.props.navigator.pop();
      })
      .catch((err) => {
        console.log(err.message);
      });

  },

  onNavigationStateChange: function(navState) {
    console.log("onNavigationStateChange");
    console.log(navState);
    console.log(navState.url)
    var url = navState.url.toString();
    var prefix = "http://www.duokan.com/m/"
    if(url.slice(0, prefix.length) == prefix && url != REQUEST_URL){
      fetch(REQUEST_URL,{
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


module.exports = SaveAccount;
