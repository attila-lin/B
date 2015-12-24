'use strict';

var React = require('react-native');
var md5 = require('md5');

var Result = require('./Result');

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
} = React;

var BODY_CONST = "_json=true&callback=https%3A%2F%2Faccount.xiaomi.com%2Fsts%3Fsign%3DZvAtJIzsDsFe60LdaPa76nNNP58%253D%26followup%3Dhttps%253A%252F%252Faccount.xiaomi.com%252Fpass%252Fauth%252Fsecurity%252Fhome%26sid%3Dpassport&sid=passport&qs=%253Fcallback%253Dhttps%25253A%25252F%25252Faccount.xiaomi.com%25252Fsts%25253Fsign%25253DZvAtJIzsDsFe60LdaPa76nNNP58%2525253D%252526followup%25253Dhttps%2525253A%2525252F%2525252Faccount.xiaomi.com%2525252Fpass%2525252Fauth%2525252Fsecurity%2525252Fhome%252526sid%25253Dpassport%2526sid%253Dpassport&_sign=2%26V1_passport%26JO7oplyppgkN%2FTiDH69nleQr10g%3D&serviceParam=%7B%22checkSafePhone%22%3Afalse%7D&";

var SaveAccount = React.createClass({

  getInitialState: function() {
    console.log("SaveAccount");
    return {
      account: "账号",
      passwd: "密码",
    };
  },

  _onPressButton: function() {
    // console.log("papapap",this.state.account);
    AsyncStorage.setItem("account",this.state.account);
    AsyncStorage.setItem("passwd",this.state.passwd);

    AsyncStorage.getItem("account").then( (value) =>
      {
        console.log("account", value);
      }
    ).done();

    AsyncStorage.getItem("passwd").then( (value) =>
      {
        console.log("passwd", value);
      }
    ).done();

    // TODO 验证账号
    fetch('https://account.xiaomi.com/pass/serviceLoginAuth2', {
      method: 'POST',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: BODY_CONST+'user='+ encodeURIComponent(this.state.account) + "&hash=" + md5(this.state.passwd)
    })
    .then((response) => console.log( response.headers ))
    // .then((response) => response.headers.json())
    // .then((responseData) => {
    //     AlertIOS.alert(
    //         "POST Response",
    //         "Response Body -> " + JSON.stringify(responseData.body)
    //     )
    // })
    .done();

    if (this.props.navigator) {
      this.props.navigator.pop();
      this.props.navigator.push({
          title: 'Result',
          component: Result,
          passProps: {  }
      });
    }
  },

  render: function () {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={this.state.account}
          onChangeText={(text) => this.setState({ account : text})}
        />
        <TextInput
          style={styles.textInput}
          value={this.state.passwd}
          onChangeText={(text) => this.setState({ passwd : text})}
          secureTextEntry={true}
        />
        <TouchableHighlight onPress={this._onPressButton}>
          <Image
            style={styles.button}
          />
        </TouchableHighlight>
      </View>
      );
    }
});

var styles = StyleSheet.create({
    container: {
      marginTop: 64,
      justifyContent: 'center',
      alignItems: 'center',
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
});


module.exports = SaveAccount;
