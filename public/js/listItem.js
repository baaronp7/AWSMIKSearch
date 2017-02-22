'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var listItems = React.createClass({
    getInitialState: function() {
        this.state = {};
        return({ message: null });
    },
    componentDidMount: function() {
        console.log("test");
        console.log(this.props.items[0]);
        this.setState({
            items: this.props.items
        });
    },
    render: function() {
        {this.state.items.map(function(term, i) {
            console.log(term["_source"].phrase);
            return <li key={i}>{term["_source"].phrase}</li>
        })}
    }
});

export default listItems;