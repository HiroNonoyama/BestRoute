import React, { Fragment } from "react";
import debounce from "lodash.debounce";

import { API_KEY } from "../constants";

const WithAutoComplete = Component =>
  class extends React.PureComponent {
    constructor(props) {
      super(props);
      const random = Math.random();
      this.state = { predictions: [], isOpen: false, id: random };
    }

    _autoComplete(query) {
      const { id } = this.state;
      const selector = document.querySelector(`input[data-input="${id}"]`);
      const input = new google.maps.places.Autocomplete(
        document.querySelector(`input[data-input="${id}"]`)
      );
      input.addListener("place_changed", () => {
        const place = input.getPlace();
        this.props.handleInput({
          value: place.name,
          formattedAddress: place.formatted_address,
        });
      });
    }

    render() {
      const { id } = this.state;
      return (
        <Fragment>
          <Component
            autoComplete={debounce(value => this._autoComplete(value), 1000)}
            randomId={id}
            {...this.props}
          />
        </Fragment>
      );
    }
  };

export default WithAutoComplete;
