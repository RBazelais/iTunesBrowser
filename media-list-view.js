'use strict';
import React, { Component } from 'react';
import {  ActivityIndicator, View, Text, TextInput, ListView } from 'react-native';

import styles from './styles';
//import MediaCell from './media-cell';

//a safeguard to prevent exceptions from being thrown
//time out
//TimerMixin can only be used with "React.createClass" because es6 deprecated it somehow...wtf
//import TimerMixin from 'react-timer-mixin';
var TimerMixin = require('react-timer-mixin');

var MediaCell = require('./media-cell');

//search itunes url
var API_URL = 'https://itunes.apple.com/search';

//loading indicator hash
var LOADING = {};

//A sample resultsCache that contains the fetch data for recent queries
var resultsCache = {
  dataForQuery: {}
};

//automatically start searching when a user stopes typing for a certain amount of time
//class SearchBar extends React.Component {
var SearchBar = React.createClass({
 render: function() {
  return (
    <View style= { styles.listView.searchBar }>
      <TextInput
        autoCapitalize = "none"
        autoCorrect = { false }
        placeholder = "Search for media on iTunes..."

        //gets search key in keyboard instead or return
        returnKeyType = "search"
        enablesReturnKeyAutomatically = { true }
        style = { styles.listView.searchBarInput }

        //callback gets executed when the search key is pressed or the keyboard is dismissed
        onChange = { this.props.onSearch }
      />

      <ActivityIndicator
      //native component
        animating = { this.props.isLoading }
        style = { styles.listView.spinner }
      />

    </View>
  );
 }
});


//TimerMixin was deprecated so the only way to use it for now is with the OLDER React.createClass standard
var MediaListView = React.createClass({

  mixins: [TimerMixin],

    getInitialState: function () {
      return {
        isLoading: false,
        query: '',
        resultsData: new ListView.DataSource({
          //this function tells the ListView if a row has changed
          rowHasChanged: (row1, row2) => row1 !== row2
        })

      };
    },

    // gets called after the compnent got mounted from another component?
    //have some data already present from mission impossible search
    componentDidMount: function () {
      this.searchMedia('Resident Evil');
    },

    timeoutID: (null: any),

    _urlForQuery: function (query: string): string{
      if (query.length > 2){
        return API_URL + '?media=movie&term=' + encodeURIComponent(query);
      }
    },

    //helper method that sets the DataSource
    //takes current DataSource and clone it with new rows as it's data
    getDataSource: function (mediaItems: Array<any>): ListView.DataSource{
      return this.state.resultsData.cloneWithRows(mediaItems);
    },

    searchMedia: function (query: string){
       //reset timeoutID to null; doesn't need to get cleaned up by mixer
       this.timeoutID = null;

       //whenever the user searches for media, set the state to store the current query
       this.setState({ query: query });

       //hit cache or data from our query
       var cachedResultsForQuery = resultsCache.dataForQuery[query];

       //if we get a cache hit && there is any other search
       //currently LOADING, return the data
       if(cachedResultsForQuery){
         if(!LOADING[query]){
           //Test: Display alert view for cache results
           //AlertIOS.alert('Number of results: ', responseData.resultCount + ' cached results');

           //store the resultsData when we hit the cache
           this.setState({
             isLoading: false,
             resultsData: this.getDataSource(cachedResultsForQuery),
           });
         } else {
             this.setState({
               isLoading: true
             });
           }
       //otherwise fetch data from api
       } else {
         //variable that holds the query
         var queryURL = this._urlForQuery(query);

         //check if query url is valid
         if (!queryURL){
           return;
         }

         //set state to isLoading before network request is started
         this.setState({
           isLoading: true
         });

         //set loading indicator and clear out cache data
         LOADING[query] = true;
         resultsCache.dataForQuery[query] = null;

         //fetch request returns a promise
         fetch(queryURL)
            //transform reults into JSON once the promise is fulfilled
            .then((response) => response.json())
            //if we get an error set loading indicator and the query to false
            //and then set cache results to undefined
            .catch((error) => {
              LOADING[query] = false;
              resultsCache.dataForQuery[query] = undefined;

              this.setState({
                isLoading: false,
                resultsData: this.getDataSource([])
              });
            })
            //filter the items by only keeping them when the wrapperType isnt't collection
            .then((responseData) =>{
              return responseData.results.filter((e) => e.wrapperType !== 'collection');
            })
            //if there wasn't any error set loading indicator to false
            //then fill the cache with our response data
            .then((responseData) => {
              LOADING[query] = false;
              resultsCache.dataForQuery[query] = responseData;

              this.setState({
                isLoading: false,
                resultsData: this.getDataSource(resultsCache.dataForQuery[query])
              });
              //test: display alert view with the number of results
              //AlertIOS.alert('Number of results: ', responseData.resultCount + ' results');
            });
        }
    },


    render() {
      var content = null;

      return (
        <View>

          <SearchBar
            //whenever it is loading update the state on the component
            isLoading = { this.state.isLoading }

            onSearch = { (event) => {
              //extract the string from search field
              var searchString = event.nativeEvent.text.trim();

              //AlertIOS.alert('Searching for...', searchString);
              //typescript start here | Replace alertview with search function
              TimerMixin.clearTimeout(this.timeoutID);
              //call the search function and replace it with the current searchString
              this.timeoutID = TimerMixin.setTimeout(() => this.searchMedia(searchString), 250);


            }}
          />

          <View style = { [ styles.listView.separator, { "marginLeft": 0 } ] }
            //separator between searchbar and list viewz
            >
            <ListView
            //Take DataSource from state then use two methods to render the conetent
                dataSource = { this.state.resultsData }
                renderRow = { this.renderRow }
                renderSeparator = { this.renderSeparator }

                //do NOT automatically adjust the content insets
                //fixes additional offset of the ListView & keeps it from being stuck underneath the navigation bar
                automaticallyAdjustContentInsets = { false }

                //dismiss keyboard when dragging/scrolling
                keyboardDismissMode = 'on-drag'
            />
          </View>
        </View>
      );
    },

    //key - creates a  unique identifier for this component
    renderSeparator: function (
      sectionID: number | string,
      rowID: number | string,
      adjacentRowHighlighted: boolean,
    ){
      return(
        <View
          key = { "SEP_" + sectionID + "_" + rowID }
          style = { [styles.listView.rowSeparator, adjacentRowHighlighted && styles.listView.rowSeparatorHighlighted] }
        />
      )
    },

    //test: Display title to make sure function works: <Text> { media.trackName } </Text>
    //callbacks! Can tell the listView if a cell got highlighted or not
    renderRow: function(
      media: Object,
      sectionID: number | string,
      rowID: number | string,
      highlightRowFunction: ( sectionID: ?number | string, rowID: ?number | string ) => void,
    ){
      //returns a custom cell
      return (

        <MediaCell
          media = { media }
          //onSelect = {() => this.selectMediaItem( media ) }
          onHighlight = { () => highlightRowFunction( sectionID, rowID ) }
          onDeHighlight = { () => highlightRowFunction( null, null ) }
        />
      );
    }
 });


module.exports = MediaListView;
