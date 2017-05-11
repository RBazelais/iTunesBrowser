'use strict';

import React, { Component } from 'react';
import {  StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
    },

    container: {
      flex: 1,
      width: undefined,
      height: undefined,
      backgroundColor:'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },

    navbar: {
      backgroundColor: '#2A3744',
      paddingTop: 30,
      paddingBottom: 10,
      flexDirection: 'row',
    },
    navbarTitle: {
      color: '#FEFEFE',
      textAlign: 'center',
      fontWeight: 'bold',
      flex: 1,
    },

});

// navbarButton: {
//   width: 50,
//   color: '#FEFEFE',
//   textAlign: 'center',
// },

//////////
/*
text: {
  textAlign: 'left',
  color: '#FAF0E6',
  marginBottom: 5,
  height: 50,
  flex: 1
},
registration: {
  textAlign: 'center',
  fontSize: 20,
  fontWeight:'bold',
  height: 10,
  backgroundColor: '#f08080',
  padding: 25,
  alignItems: 'center',
  flex: 1/2,
  },

 onScreenButton: {
   flex:1,
   justifyContent: 'center',
   alignItems: 'center',
   alignSelf:'stretch',

 }*/
module.exports = dashboardStyles;
