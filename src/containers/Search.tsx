import * as React from "react";

import * as styles from "../../styles/containers/Search.scss";
import TextInputArea from "./TextInputArea";

interface Form {
  placeholder: string;
  value: string;
  formattedAddress: string;
}

interface SearchState {
  form: Form[];
  firstForm: Form;
  lastForm: Form;
  result: any;
}

class Search extends React.PureComponent<SearchState> {
  state = {
    form: [{ placeholder: "東京タワー", value: "", formattedAddress: "" }],
    firstForm: {
      placeholder: "東京駅",
      value: "",
      formattedAddress: "",
    },
    lastForm: {
      placeholder: "横浜駅",
      value: "",
      formattedAddress: "",
    },
    result: {},
  };

  componentDidMount() {
    setTimeout(() => {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      const mapEntryPoint = document.getElementById("map");
      this.map = new google.maps.Map(mapEntryPoint, {
        zoom: 10,
        center: { lat: 35.65, lng: 139.83 },
      });

      this.directionsDisplay.setMap(this.map);
    }, 1000);
  }

  _handleAddButton = () => {
    const { form } = this.state;
    this.setState({
      form: [...form, { placeholder: "", value: "", formattedAddress: "" }],
    });
    const lastFormIndex = form.length + 1;

    setTimeout(() => {
      document.getElementById(`textInput-VIA${lastFormIndex}`).focus();
    }, 500);
  };

  _searchDirection = () => {
    const { form, firstForm, lastForm } = this.state;
    const waypoints = form
      .filter(({ value }) => value !== "")
      .map(({ value, formattedAddress }) => ({
        location: formattedAddress ? formattedAddress : value,
      }));

    if (
      firstForm.value !== "" &&
      lastForm.value !== "" &&
      waypoints.length > 0
    ) {
      const origin = firstForm.formattedAddress
        ? firstForm.formattedAddress
        : firstForm.value;
      const destination = lastForm.formattedAddress
        ? lastForm.formattedAddress
        : lastForm.value;

      const request = {
        origin,
        destination,
        waypoints,
        provideRouteAlternatives: false,
        travelMode: "DRIVING",
        optimizeWaypoints: true,
      };

      this.directionsService.route(request, (result, status) => {
        if (status === "OK") {
          this._validationLineColorChange();
          this.setState({ result });
          this.directionsDisplay.setDirections(
            this._nameModify(result, waypoints)
          );
        } else {
          const { geocoded_waypoints } = result;
          if (geocoded_waypoints) {
            let validatedFirst;
            let validatedLast;
            const validatedIndexes = [];
            geocoded_waypoints.map(({ geocoder_status }, index) => {
              if (geocoder_status === "ZERO_RESULTS") {
                switch (index) {
                  case 0:
                    validatedFirst = true;
                    return;
                  case geocoded_waypoints.length - 1:
                    validatedLast = true;
                    return;
                  default:
                    validatedIndexes.push(index - 1);
                }
              }
            });
            this._validationLineColorChange(
              validatedFirst,
              validatedLast,
              validatedIndexes
            );
          } else {
            this._validationLineColorChange();
            alert("検索ワードを変えてもう一度試してください");
          }
        }
      });
    }
  };

  _nameModify(result, waypoints) {
    const { legs, waypoint_order } = result.routes[0];
    const { firstForm, lastForm } = this.state;
    legs.map((leg, index) => {
      if (index === 0) {
        leg["start_address"] = firstForm.value;
      } else if (index === legs.length - 1) {
        leg["start_address"] = waypoints[waypoint_order[index - 1]].location;
        leg["end_address"] = lastForm.value;
      } else {
        leg["start_address"] = waypoints[waypoint_order[index - 1]].location;
      }
    });
    return result;
  }

  _validationLineColorChange(isStart = false, isGoal = false, isVias = []) {
    const startForm = document.getElementById("textInput-START");
    const goalForm = document.getElementById("textInput-GOAL");
    const { form } = this.state;

    if (isStart) {
      startForm.style.cssText = "border-color: #ff7070;";
    } else {
      startForm.style.cssText = "border-color: white;";
    }

    if (isGoal) {
      goalForm.style.cssText = "border-color: #ff7070;";
    } else {
      goalForm.style.cssText = "border-color: white;";
    }

    form.filter(({ value }) => value !== "").forEach(({ value }, index) => {
      const form = Array.from(
        document.querySelectorAll(`input[value="${value}"]`)
      );
      if (isVias.indexOf(index) === -1) {
        form.map((v: any) => (v.style.cssText = "border-color: white;"));
      } else {
        form.map((v: any) => (v.style.cssText = "border-color: #ff7070;"));
      }
    });
  }

  _handleSearchPress = () => {
    const { form, firstForm, lastForm } = this.state;
    const filledFormLength = form.filter(v => v.value !== "").length;
    const isFirstFilled = firstForm.value !== "";
    const isLastFilled = lastForm.value !== "";
    if (filledFormLength > 0 && isFirstFilled && isLastFilled) {
      this._searchDirection();
    } else {
      alert("START, GOAL, また、VIAを一つ以上入力してください");
    }
  };

  _handleRemoveButton = (index, random) => {
    const { form } = this.state;
    const nextForm = form.filter((_, i) => i !== index);
    const target = document.querySelector(`div[data-index="${random}"]`)
      .classList;
    target.remove(styles.fadeout);
    setTimeout(() => target.add(styles.fadeout), 20);
    setTimeout(() => {
      this.setState({ form: nextForm });
    }, 300);
  };

  _handleInput = (value, formattedAddress = "", index) => {
    if (index >= 0) {
      const { form } = this.state;
      const targetForm = { ...form[index], value, formattedAddress };
      const nextForm = form.map((v, i) => (index === i ? targetForm : v));
      this.setState({ form: nextForm });
    } else if (index === -1) {
      this.setState({
        firstForm: { placeholder: "", value, formattedAddress },
      });
    } else if (index === -2) {
      this.setState({ lastForm: { placeholder: "", value, formattedAddress } });
    }
  };

  render() {
    const { firstForm, lastForm, form } = this.state;
    return (
      <div className={styles.container}>
        <TextInputArea
          firstForm={firstForm}
          lastForm={lastForm}
          form={form}
          searchDirection={this._searchDirection}
          handleRemoveButton={this._handleRemoveButton}
          handleInput={this._handleInput}
          handleSearchPress={this._handleSearchPress}
          handleAddButton={this._handleAddButton}
        />
      </div>
    );
  }
}

export default Search;
