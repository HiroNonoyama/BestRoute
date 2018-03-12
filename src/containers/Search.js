import React from "react";
import classNames from "classnames";
import FontAwesome from "react-fontawesome";

import TextInputWithAutoComplete from "../components/TextInput";
import styles from "../../styles/containers/Search.scss";

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      form: [{ placeholder: "Tokyo tower", value: "", formattedAddress: "" }],
      firstForm: {
        placeholder: "Tokyo station",
        value: "",
        formattedAddress: "",
      },
      lastForm: {
        placeholder: "Yokohama station",
        value: "",
        formattedAddress: "",
      },
    };
  }

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
          this.validationLineColorChange();
          this.directionsDisplay.setDirections(result);
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
            this.validationLineColorChange(
              validatedFirst,
              validatedLast,
              validatedIndexes
            );
          } else {
            this.validationLineColorChange();
            alert("検索ワードを変えてもう一度試してください");
          }
        }
      });
    }
  };

  validationLineColorChange(isStart = false, isGoal = false, isVias = []) {
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
        form.map(v => (v.style.cssText = "border-color: white;"));
      } else {
        form.map(v => (v.style.cssText = "border-color: #ff7070;"));
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

  _handleRemoveButton(index, random) {
    const { form } = this.state;
    const nextForm = form.filter((_, i) => i !== index);
    const target = document.querySelector(`div[data-index="${random}"]`)
      .classList;
    target.remove(styles.fadeout);
    setTimeout(() => target.add(styles.fadeout), 20);
    setTimeout(() => {
      this.setState({ form: nextForm });
    }, 300);
  }

  _handleInput(value, formattedAddress = "", index) {
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
  }

  render() {
    const { firstForm, form, lastForm } = this.state;

    return (
      <div className={styles.container}>
        <div className={classNames(styles.wrap, styles.fadein)}>
          <TextInputWithAutoComplete
            placeholder={firstForm.placeholder}
            label="START"
            value={firstForm.value}
            handleInput={e =>
              this._handleInput(e.value, e.formattedAddress, -1)
            }
            handleEnter={this._searchDirection}
          />
        </div>
        {form.map(({ placeholder, value }, index) => {
          const random = Math.random();
          return (
            <div
              className={classNames(styles.wrap, styles.fadein)}
              key={index}
              data-index={random}
            >
              {form.length > 1 && (
                <a
                  className={styles.removeButton}
                  onClick={() => this._handleRemoveButton(index, random)}
                >
                  <FontAwesome name="times-circle" size="1x" />
                </a>
              )}
              <TextInputWithAutoComplete
                placeholder={placeholder}
                label={`VIA${index + 1}`}
                value={value}
                handleInput={e =>
                  this._handleInput(e.value, e.formattedAddress, index)
                }
                handleEnter={this._searchDirection}
              />
              {index === form.length - 1 && (
                <a className={styles.addButton} onClick={this._handleAddButton}>
                  <FontAwesome name="plus-circle" size="2x" />
                </a>
              )}
            </div>
          );
        })}
        <div className={classNames(styles.wrap, styles.fadein)}>
          <TextInputWithAutoComplete
            placeholder={lastForm.placeholder}
            label="GOAL"
            value={lastForm.value}
            handleInput={e =>
              this._handleInput(e.value, e.formattedAddress, -2)
            }
            handleEnter={this._searchDirection}
          />
        </div>
        <div className={styles.searchButtonWrap}>
          <input
            className={styles.searchButton}
            type="button"
            value="検索"
            onClick={this._handleSearchPress}
          />
        </div>
      </div>
    );
  }
}

export default Search;
