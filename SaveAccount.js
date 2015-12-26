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

// var BODY_CONST = "_json=true&callback=https%3A%2F%2Faccount.xiaomi.com%2Fsts%3Fsign%3DZvAtJIzsDsFe60LdaPa76nNNP58%253D%26followup%3Dhttps%253A%252F%252Faccount.xiaomi.com%252Fpass%252Fauth%252Fsecurity%252Fhome%26sid%3Dpassport&sid=passport&qs=%253Fcallback%253Dhttps%25253A%25252F%25252Faccount.xiaomi.com%25252Fsts%25253Fsign%25253DZvAtJIzsDsFe60LdaPa76nNNP58%2525253D%252526followup%25253Dhttps%2525253A%2525252F%2525252Faccount.xiaomi.com%2525252Fpass%2525252Fauth%2525252Fsecurity%2525252Fhome%252526sid%25253Dpassport%2526sid%253Dpassport&_sign=2%26V1_passport%26JO7oplyppgkN%2FTiDH69nleQr10g%3D&serviceParam=%7B%22checkSafePhone%22%3Afalse%7D&";
var BGWASH = 'rgba(255,255,255,0.8)';
var WEBVIEW_REF = 'webview';
var REQUEST_URL = "http://www.duokan.com/store/v0/payment/book/list"
// var url = "https://account.xiaomi.com/pass/serviceLogin";
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
    // console.log(JSON.parse(response._bodyInit));
    this.setState({bookJson : JSON.parse(response._bodyInit)});

    // AsyncStorage.setItem("doubanBooks",this.state.bookJson.toString());
    // create a path you want to write to
    var path = RNFS.DocumentDirectoryPath + '/doubanBooks.txt';

    // write the file
    RNFS.writeFile(path, this.state.bookJson, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });

    this.props.navigator.pop();
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
        // console.log(this.state.bookJson);
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
