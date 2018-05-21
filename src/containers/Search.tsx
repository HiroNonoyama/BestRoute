import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import * as classNames from "classnames";

import * as styles from "../../styles/containers/Search.scss";
import TextInputArea from "./TextInputArea";

export enum TravelMode {
  DRIVING = "DRIVING",
  // BICYCLING = "BICYCLING",
  TRANSIT = "TRANSIT",
  WALKING = "WALKING",
}

interface Form {
  placeholder: string;
  value: string;
  formattedAddress: string;
}

interface SearchState {
  form: Form[];
  firstForm: Form;
  lastForm: Form;
  travelMode: TravelMode;
}

class Search extends React.PureComponent<SearchState> {
  private directionsDisplay: any;
  private directionsService: any;
  private map: any;

  state: SearchState = {
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
    travelMode: TravelMode.DRIVING,
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
    const { form, travelMode } = this.state;
    this.setState({
      form: [...form, { placeholder: "", value: "", formattedAddress: "" }],
    });
    const lastFormIndex = form.length + 1;

    setTimeout(() => {
      document.getElementById(`textInput-VIA${lastFormIndex}`).focus();
    }, 500);
  };

  _searchDirection = () => {
    const { form, firstForm, lastForm, travelMode } = this.state;
    const waypoints = form
      .filter(({ value }) => value !== "")
      .map(({ value, formattedAddress }) => ({
        location: formattedAddress ? formattedAddress : value,
      }));

    if (
      firstForm.value !== "" &&
      lastForm.value !== "" &&
      (waypoints.length > 0 || travelMode === TravelMode.TRANSIT)
    ) {
      const origin = firstForm.formattedAddress
        ? firstForm.formattedAddress
        : firstForm.value;
      const destination = lastForm.formattedAddress
        ? lastForm.formattedAddress
        : lastForm.value;

      const request: any = {
        origin,
        destination,
        waypoints,
        provideRouteAlternatives: false,
        travelMode: travelMode,
        optimizeWaypoints: true,
      };

      if (travelMode === TravelMode.TRANSIT) {
        request.transitOptions = {
          modes: ["RAIL"],
          departureTime: new Date(),
        };
        request.waypoints = [];
      }

      this.directionsService.route(request, (result, status) => {
        console.log(result);
        if (status === "OK") {
          this._validationLineColorChange();
          this.props.setResult(this._nameModify(result, waypoints));
          this.directionsDisplay.setDirections(
            this._nameModify(result, waypoints)
          );
          if (window.innerWidth) {
            const { y } = document
              .getElementById("map")
              .getBoundingClientRect();
            document.getElementsByTagName("body")[0].scrollTop = y;
          }
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
    const { form, firstForm, lastForm, travelMode } = this.state;
    const filledFormLength = form.filter(v => v.value !== "").length;
    const isFirstFilled = firstForm.value !== "";
    const isLastFilled = lastForm.value !== "";
    if (
      travelMode === TravelMode.TRANSIT ||
      (filledFormLength > 0 && isFirstFilled && isLastFilled)
    ) {
      this._searchDirection();
    } else {
      alert("START, GOAL, また、VIAを一つ以上入力してください");
    }
  };

  _handleRemoveButton = (index, random) => {
    const { form } = this.state;
    const nextForm = form.filter((_, i) => i !== index);
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

  _iconName(mode) {
    switch (mode) {
      case TravelMode.BICYCLING:
        return "bicycle";
      case TravelMode.TRANSIT:
        return "subway";
      case TravelMode.WALKING:
        return "male";
      case TravelMode.DRIVING:
      default:
        return "car";
    }
  }

  _handleIconClick = mode => {
    this.setState({ travelMode: TravelMode[mode] });
  };

  render() {
    const { firstForm, lastForm, form } = this.state;
    const { travelMode } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.travelModeTabsWrap}>
          <div className={styles.travelModeTab}>
            {Object.keys(TravelMode).map(mode => {
              const isSelected = TravelMode[mode] === travelMode;
              return (
                <div
                  key={mode}
                  onClick={() => {
                    this._handleIconClick(mode);
                  }}
                  className={classNames(styles.iconButton, {
                    [styles.selectedButton]: isSelected,
                  })}
                >
                  <FontAwesome
                    name={this._iconName(TravelMode[mode])}
                    size="lg"
                    className={classNames(styles.icon, {
                      [styles.selectedIcon]: isSelected,
                    })}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <TextInputArea
          firstForm={firstForm}
          lastForm={lastForm}
          form={form}
          searchDirection={this._searchDirection}
          handleRemoveButton={this._handleRemoveButton}
          handleInput={this._handleInput}
          handleSearchPress={this._handleSearchPress}
          handleAddButton={this._handleAddButton}
          selected={travelMode}
        />
      </div>
    );
  }
}

export default Search;
