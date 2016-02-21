const React = require('react')
const { flickrSearch } = require('./model.js')
const DragImage = require('dragimage')


module.exports = React.createClass({
  displayName: 'Flickr',

  // getInitialState :: {term :: String}
  getInitialState() {
    return { 
      term: "", 
      results: [] 
    }
  },

  //updateResults
  updateResults(xs) { this.setState({ results: xs }) },

  //termChanged :: Event -> State Term
  termChanged({currentTarget: t}) { this.setState({term: t.value}) },

  //searchClicked :: Event -> ?
  searchClicked(_) { flickrSearch(this.state.term).fork(this.props.showError, this.updateResults) },

  //onDragStart :: Event -> ?
  onDragStart({ dataTransfer: dt, currentTarget: t }) { dt.setData('text', t.src) },

  render() {
    const imgs = this.state.results.map( p => <DragImage src={p.src} key={p.src} /> )
    return (
      <div id="flickr">
        <input onChange={this.termChanged} />
        <button onClick={this.searchClicked}>Search</button>
        <div id="results">{imgs}</div>
      </div>
    );
  }
});

