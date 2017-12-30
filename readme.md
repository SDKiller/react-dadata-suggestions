# react-dadata-suggestions v.0.0.1

Just another one React component for [dadata suggestions](https://dadata.ru/suggestions/ "official website").
Current version of component supports suggestions for address only.

## Getting started

### Basic usage

```
import React, { Component } from 'react';
import DadataSuggestions from 'react-dadata-suggestions';

const token = 'your_token';

class App extends Component {
  render() {
    return (
      <DadataSuggestions
        token={ token }
        onSelect={ (suggestion) => console.log(suggestion) }
      />
    );
  }
}

export default App;

```

### Available props

#### Options
* `token` - string, api token, required
* `count` - integer, limit for list of suggestions. Optional. Default value is `10`, maximum is `20`. 
* `hint` - string, hint for user in suggestions list. Optional. Default value `Выберите вариант ниже или продолжите ввод`
* `minChars` - integer, minimum length of query for requesting to api. Optional, default `3`
* `geolocation` - boolean, priority to user city. Optional. Default `true`;

#### Callbacks
* `onSelect(suggestion)` - be called when user select the address from suggestions. **Required!**
The structure of `suggestion` can be found in [official documentation](https://confluence.hflabs.ru/pages/viewpage.action?pageId=204669107)
* `onChange(query)` - be called when user typing something in input field. Optional.

##License

This project is licensed under the MIT License
