import * as React from "react";
import * as classNames from "classnames";
import * as FontAwesome from "react-fontawesome";

import * as styles from "../../styles/containers/Result.scss";

interface ResultProps {
  expand: () => void;
  shrink: () => void;
  isShowed: boolean;
  result: any;
}

export default class Result extends React.Component<ResultProps> {
  private ref;

  componentWillReceiveProps(nextProps) {
    const nextResult = nextProps.result;
    const { result } = this.props;

    JSON.stringify(result) !== JSON.stringify(nextResult) &&
      !!nextResult.routes &&
      this.fadeIn();
  }

  fadeIn = () => {
    const target = this.ref.classList;
    target.remove(styles.fadeOut);
    setTimeout(() => {
      this.props.expand();
      target.add(styles.fadeIn);
    }, 1);
  };

  fadeOut = () => {
    const target = this.ref.classList;
    target.remove(styles.fadeIn);
    setTimeout(() => {
      this.props.shrink();
      target.add(styles.fadeOut);
    }, 1);
  };

  _convertToEnglish(value) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const hoursText = hours > 0 ? `${hours} Hours` : "";
    const minutesText = minutes > 0 ? `${minutes} Minutes` : "";
    return hoursText + minutesText;
  }

  render() {
    const { isShowed, result } = this.props;
    const resultPresent = !!result.routes;

    const resultSummary =
      resultPresent &&
      result.routes[0].legs.map(leg => {
        return {
          duration: leg.duration,
          distance: leg.distance,
          end: leg.end_address,
          start: leg.start_address,
        };
      });
    const lastIndex = resultSummary.length - 1;
    return (
      <div
        ref={ref => {
          this.ref = ref;
        }}
        className={styles.container}
      >
        {resultPresent ? (
          <React.Fragment>
            <a
              role="button"
              className={styles.button}
              onClick={isShowed ? this.fadeOut : this.fadeIn}
            >
              {isShowed ? (
                <FontAwesome name="chevron-right" size="lg" />
              ) : (
                <FontAwesome name="chevron-left" size="lg" />
              )}
            </a>
            <div className={styles.resultWrap}>
              {resultSummary.map((leg, index) => {
                return (
                  <div className={styles.row} key={index}>
                    <div className={styles.name}>
                      <div className={styles.point}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={styles.start}>{leg.start}</span>
                    </div>
                    <div className={styles.infoWrap}>
                      <div className={styles.dot} />
                      <div className={styles.info}>
                        {`${leg.distance.text} / ${this._convertToEnglish(
                          leg.duration.value
                        )}`}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className={styles.row}>
                <div className={styles.name}>
                  <div className={styles.point}>
                    {String.fromCharCode(65 + lastIndex + 1)}
                  </div>
                  <span className={styles.start}>
                    {resultSummary[lastIndex].end}
                  </span>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <span />
        )}
      </div>
    );
  }
}
