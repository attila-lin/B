'use strict';

var RNFS = require('react-native-fs');

class Common {

  static getEmptyBookJsonStr()
  {
    var emptyJson = {
      count: 0,
      items: [],
    };
    // console.log("JSON.stringify(emptyJson)", JSON.stringify(emptyJson))

    return JSON.stringify(emptyJson);
  }

  static getEmptyBookJson()
  {
    return {count:0, items: []};
  }

  static ReadFile(fileName, callback)
  {
    RNFS.readDir(RNFS.DocumentDirectoryPath)
    .then((result) => {
      for (var i = 0; i < result.length; i++) {
        console.log("fileName",fileName, result[i].name);
        if(result[i].name === fileName){
          return Promise.all([RNFS.stat(result[i].path), result[i].path]);
        }
      }
    })
    .then((statResult) => {
      if (statResult === undefined){
        return null;
      }

      if (statResult[0].isFile()) {
        return RNFS.readFile(statResult[1], 'utf8');
      }
      else {
        return null;
      }

    })
    .then((contents) => {
      callback(contents);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    })
  }
}

Common.DOUBAN_BOOKS_JSON_NAME = "doubanBooks.txt";
Common.DUOKAN_BOOKS_JSON_NAME = "duokanBooks.txt";
Common.SHITI_BOOKS_JSON_NAME = "shitiBooks.txt";

module.exports = Common;
