'use strict';

var React = require('react-native');

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

var SaveAccount = React.createClass({

  getInitialState: function() {
     return {
        account: "账号",
        passwd: "密码"
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


    // console.log(this.props.navigator);
    if (this.props.navigator) {
      this.props.navigator.pop();
      this.props.navigator.push({
          name: 'result'
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
      flex: 1,
      backgroundColor: 'white',
    },

    textInput:{
      height: 40,
      borderColor: 'gray',
      borderWidth: 1
    },

    rowSplitLine: {
      height: 1,
      backgroundColor: '#e5e5e5',
      marginLeft: 20,
      marginRight: 20,
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
});


module.exports = SaveAccount;
