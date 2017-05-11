import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';

export default class iTunesBrowser extends Component {
  render() {
    return (
      <View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export.module = iTunesBrowser;
