import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/styles.less';

import SuggestionsList from './components/SuggestionsList';
import QueryInput from './components/QueryInput';

import { handleKeyPress } from './handlers';

import Api from './api/FetchApi';
import { buildRequestBody } from "./api/helpers";
import { SHORT_TYPES } from "./constants/index";

class DadataSuggestions extends Component {

  static propTypes = {
    token: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    //deferRequestBy: PropTypes.number.isRequired, // doesn't work with fetch Api
    hint: PropTypes.string.isRequired,
    minChars: PropTypes.number.isRequired,
    geolocation: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    highlighting: PropTypes.bool.isRequired,
    specialRequestOptions: PropTypes.object,

    //handlers:
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    suggestionsFormatter: PropTypes.func,
    selectedSuggestionFormatter: PropTypes.func,
  };

  static defaultProps = {
    token: '',
    count: 10,
    //deferRequestBy: 300,
    minChars: 3,
    geolocation: true,
    hint: 'Выберите вариант ниже или продолжите ввод',
    query: '',
    service: 'address',
    highlighting: true,
  };

  constructor(props) {
    super(props);
    const {token, service, geolocation} = props;
    this.api = new Api(token, service, geolocation);
    this.handleKeyPress = handleKeyPress.bind(this);
    console.log(this);
  }

  state = {
    query: this.props.query,
    suggestions: [],
    selected: -1,
    loading: false,
    error: false,
    showSuggestions: false
  };

  fetchData = (query) => {
    this.setState({
      loading: true,
    });

    const requestBody = buildRequestBody(query, this.props);

    this.api.suggestions(requestBody)
      .then(suggestions => {
        this.setState({
          suggestions,
          loading: false,
          error: false,
          showSuggestions: true,
        });
      })
      .catch(e => this.handleError(e));
  };

  searchWords = () => {
    const { query } = this.state;
    const searchWords = query.split(/\s+/);
    const { service } = this.props;
    if (service === Api.ADDRESS) {
      return searchWords.filter(word => !SHORT_TYPES.includes(word));
    }
    return searchWords;
  };

  handleChange = (e) => {
    const query = e.target.value;
    this.setState({
      query,
      selected: -1
    });

    const {minChars} = this.props;
    if (query.length >= minChars) {
      this.fetchData(query);
    } else {
      this.setState({
        suggestions: [],
      });
    }

    const { onChange } = this.props;
    if (onChange) {
      onChange(query);
    }
  };

  handleError = (e) => {
    this.setState({
      error: true,
      loading: false
    });
    const { onError } = this.props;
    if (onError) {
      onError(e);
    }
  };

  handleSelect = (index) => () => {
    const selectedSuggestion = this.state.suggestions[index];
    const query = this.selectedSuggestionFormatter(selectedSuggestion);

    this.setState({
      selected: index,
      showSuggestions: false,
      query
    });

    const { onSelect } = this.props;
    onSelect(selectedSuggestion)
  };

  formatter = (suggestion, name) => {
    const { [name]: customFormatter } = this.props;
    if (customFormatter) {
      return customFormatter(suggestion);
    }
    return suggestion.value;
  };

  suggestionsFormatter = (suggestion) => {
    return this.formatter(suggestion, 'suggestionsFormatter')
  };

  selectedSuggestionFormatter = (suggestion) => {
    return this.formatter(suggestion, 'selectedSuggestionFormatter')
  };

  makeListVisible = () => {
    const { showSuggestions } = this.state;
    if (showSuggestions) {
      return
    }
    this.setState({showSuggestions: true});
  };

  makeListInvisible = () => {
    const { showSuggestions } = this.state;
    if (!showSuggestions) {
      return
    }
    this.setState({showSuggestions: false});
  };

  render() {
    const {loading, query, showSuggestions, suggestions, selected} = this.state;
    return (
      <div>
        <QueryInput
          onChange={ this.handleChange }
          loading={ loading }
          query={ query }
          onMouseDown={ this.makeListVisible }
          onKeyPress={ this.handleKeyPress }
        />

        <SuggestionsList
          suggestions={ suggestions }
          hint={ this.props.hint }
          visible={ showSuggestions }
          onSelect={this.handleSelect}
          selected={selected}
          suggestionsFormatter={this.suggestionsFormatter}
          searchWords={ this.searchWords }
          highlighting = { this.props.highlighting }
        />
      </div>
    );
  }
}

export default DadataSuggestions;
