import * as React from "react";
import * as debounce from "lodash.debounce";

import { API_KEY } from "../constants";

interface WithAutoCompleteState {
  predictions: any;
  isOpen: boolean;
  id: number;
}

const WithAutoComplete = (Component: any) =>
  class extends React.PureComponent<WithAutoCompleteState> {
    private random: number = Math.random();
    state = { predictions: [], isOpen: false, id: this.random };

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
        <React.Fragment>
          <Component
            autoComplete={debounce(value => this._autoComplete(value), 1000)}
            randomId={id}
            {...this.props}
          />
        </React.Fragment>
      );
    }
  };

export default WithAutoComplete;
