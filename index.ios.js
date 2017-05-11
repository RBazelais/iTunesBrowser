'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  AlertIOS
  //StatusBarIOS
} from 'react-native';
//StatusBarIOS.setStyle(StatusBarIOS.Style.lightContent);

import MediaListView from './media-list-view';

export default class iTunesBrowser extends Component {
  render() {
    return (
      //initial route gets displayed when it is rendered for the first time
      <NavigatorIOS
        style={ styles.global.mainContainer }
        barTintColor='#2A3744'
        titleTextColor= '#EFEFEF'
        tintColor='#EFEFEF'
        initialRoute = {{
          component: MediaListView,
          title: 'iTunesBrowser',
          rightButtonTitle: 'Search',

          //callback function with an alert
          onRightButtonPress: () => AlertIOS.alert(
            'Search', 'You pressed the Search button!')
        }}
      />

    );
  }
}

import styles from './styles';

AppRegistry.registerComponent('iTunesBrowser', () => iTunesBrowser);
