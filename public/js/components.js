import React from 'react'
import ReactDOM from 'react-dom'
import SearchInput, {createFilter} from 'react-search-input'

import 'whatwg-fetch';

var searchURL = searchTerm => {return 'https://mpczimfo6j.execute-api.us-east-1.amazonaws.com/prod/autocomplete?q=' + searchTerm}

import shallowCompare from 'react-addons-shallow-compare' // ES6

import listItems from './listItem.js';

class PhraseLink extends React.Component {
  getInitialState() {
      this.state = {};
      return({ message: null });
  }

  componentDidMount() {
      this.setState({
          term: this.props.term
      });
  }

  linkClicked() {
    document.querySelector('input').value = this.state.term;
  }

  render() {
    return (
      <a href="#" onClick={this.linkClicked.bind(this)}>{this.props.term}</a>
    )
  }
}


class UrlLink extends React.Component {
  getInitialState() {
      this.state = {};
      return({ message: null });
  }

  componentDidMount() {
      this.setState({
          name: this.props.name,
          url: this.props.url
      });
  }

  linkClicked() {
    window.location = this.state.url;
  }

  render() {
    return (     
      <a href="#" onClick={this.linkClicked.bind(this)}>{this.props.name}</a>
    )
  }
}

const App = React.createClass({
  getInitialState () {
    this.state = {};
    return { searchTerm: '', newResults: true, searchSuggestions: null }
  },

  render () {
    console.log("renderterm " + this.state.searchSuggestions);
    if (!this.state.searchSuggestions || this.state.searchSuggestions == null ) {
      return (
        <div>
          <SearchInput className="search-input" onChange={this.searchUpdated} />
        </div>
      );
    }
    return (
      <div>
        <div>
          <SearchInput className="search-input" onChange={this.searchUpdated} />
        </div>
        <ul>
          {this.state.searchSuggestions.data.phrases.length > 0 &&
              <li className={"title"}><h2>Phrases</h2></li>
          }
          {this.state.searchSuggestions.data.phrases.length > 0 && 
            this.state.searchSuggestions.data.phrases.map(function(term, i) {
              console.log(term);
              return <li className={"phrase"} key={i}><PhraseLink term={term}></PhraseLink></li>
            })
          }
          {this.state.searchSuggestions.data.products.hits.length > 0 &&
              <li className={"title"}><h2>Products</h2></li>
          }
          {this.state.searchSuggestions.data.products.hits.length > 0 && 
            this.state.searchSuggestions.data.products.hits.map(function(term, i) {
              console.log(term.name);
              return <li key={i}>
                <img src={term.image}/>
                <UrlLink url={term.url} name={term.name}></UrlLink>
                <div>{term.price}</div>
              </li>
            })
          }
          {this.state.searchSuggestions.data.projects.hits.length > 0 &&
              <li className={"title"}><h2>Projects</h2></li>
          }
          {this.state.searchSuggestions.data.projects.hits.length > 0 && 
            this.state.searchSuggestions.data.projects.hits.map(function(term, i) {
              console.log(term.name[0]);
              return <li key={i}>
              <img src={term.image}/>
              <UrlLink name={term.name} url={term.url}></UrlLink>
              </li>
            })
          }
        </ul>
      </div>
    );
  },

  searchUpdated (term) {
    this.setState({searchTerm: term})
  },

  shouldComponentUpdate (nextProps, nextState){    
    if (nextState.searchTerm != this.state.searchTerm) {
        return true;
    } else if (this.state.newResults) { nextState.newResults = false; return true; }
     else {return false;}

  },

  componentDidUpdate (prevProps, prevState) {
      console.log("prevState " + prevState.searchTerm);
      console.log("current " + this.state.searchTerm);
      console.log("url " + searchURL(this.state.searchTerm));
      fetch(searchURL(this.state.searchTerm))
          .then(d => d.json())
          .then(d => {
              this.setState({
                  searchSuggestions: d,
                  newResults: true
              });
              console.log(d);
          });
  }
});

ReactDOM.render(
  <App></App>,
  document.getElementById('container')
);