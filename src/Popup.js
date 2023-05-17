import React, { useEffect, useState } from "react";
import "./App.css";
import CanvasJSReact from "./canvasjs.react";
import "./popup.css";
import "./graph.css";
import Dropdown from "react-dropdown";
//TODO: make it so the dropdown goes over the graph, and not push it down
//TODO: add geolocation
//TODO: add the rain in next hour thing

function PopupHTMLTop() {
  const [selectedButton, setSelectedButton] = useState(0);
  const [forecast, setForecast] = useState(null);
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const [graph, setCurrentGraph] = useState("temp");

  function degToCompass(num) {
    const val = Math.floor(num / 22.5 + 0.5);
    const arr = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return arr[val % 16];
  }

  function getUvLevel(uv) {
    if (uv < 3) {
      return "Low";
    } else if (uv < 6) {
      return "Moderate";
    } else if (uv < 8) {
      return "High";
    } else if (uv < 11) {
      return "Very High";
    } else {
      return "Extreme";
    }
  }

  function Metric() {
    if (graph === "temp") {
      return "°";
    } else if (graph === "uvindex") {
      return " UV Index";
    } else if (graph === "windspeed") {
      return " mph";
    } else if (graph === "precip") {
      return '"';
    } else {
      return "°";
    }
  }
  class DropdownComp extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        selectedOption: null,
      };
    }

    handelChange = (selectedOption) => {
      if (selectedOption.value === "Temperature") {
        setCurrentGraph("temp");
      } else if (selectedOption.value === "UV Index") {
        setCurrentGraph("uvindex");
      } else if (selectedOption.value === "Wind") {
        setCurrentGraph("windspeed");
      } else if (selectedOption.value === "Precipitation") {
        setCurrentGraph("precip");
      } else if (selectedOption.value === "Feels Like") {
        setCurrentGraph("feelslike");
      } else {
        setCurrentGraph("temp");
      }
    };

    render() {
      const options = [
        "Temperature",
        "UV Index",
        "Wind",
        "Precipitation",
        "Feels Like",
      ];

      return (
        <div>
          <Dropdown
            options={options}
            onChange={this.handelChange}
            placeholder={"Select an option"}
          />
        </div>
      );
    }
  }

  let hoursData = null;
  if (
    forecast &&
    forecast["days"] &&
    forecast["days"][0] &&
    forecast["days"][0]["hours"]
  ) {
    hoursData = forecast["days"][selectedButton]["hours"].map(
      (hour, index) => ({
        x: index,
        y: hour[graph],
      })
    );
  }

  let gustsData = null;
  if (
    forecast &&
    forecast["days"] &&
    forecast["days"][0] &&
    forecast["days"][0]["hours"]
  ) {
    gustsData = forecast["days"][selectedButton]["hours"].map(
      (hour, index) => ({
        x: index,
        y: hour["windgust"],
      })
    );
  }

  let precipData = null;
  if (
    forecast &&
    forecast["days"] &&
    forecast["days"][0] &&
    forecast["days"][0]["hours"]
  ) {
    precipData = forecast["days"][selectedButton]["hours"].map((hour) => {
      if (hour["precip"] < 0.05 && hour["precip"] > 0) {
        return { y: 0 };
      } else {
        return { y: hour["precip"] };
      }
    });
  }
  const options =
    graph === "windspeed"
      ? {
          animationEnabled: true,
          exportEnabled: false,
          theme: "light2",
          backgroundColor: "#262626",
          axisY: {
            title: "",
            includeZero: false,
            labelPlacement: "left",
            interval: 5,
          },
          axisX: {
            title: "",
            valueFormatString: " ",
          },
          data: [
            {
              type: "line",
              toolTipContent: "Wind: {y} mph",
              dataPoints: hoursData,
            },
            {
              type: "line",
              dataPoints: gustsData,
              toolTipContent: "Gusts: {y} mph",
            },
          ],
        }
      : graph === "precip"
      ? {
          animationEnabled: true,
          theme: "light2",
          backgroundColor: "#262626",

          axisX: { title: "", valueFormatString: " " },
          axisY: {
            includeZero: false,
          },
          data: [
            {
              type: "column",
              toolTipContent: "{y}" + Metric(),
              dataPoints: precipData,
              color: "#81cffa",
            },
          ],
        }
      : {
          animationEnabled: true,
          exportEnabled: false,
          theme: "light2",
          backgroundColor: "#262626",
          axisY: {
            title: "",
            includeZero: false,
            labelPlacement: "left",
            interval: 5,
          },
          axisX: {
            title: "",
            valueFormatString: " ",
          },
          data: [
            {
              type: "line",
              toolTipContent: "{y}" + Metric(),
              dataPoints: hoursData,
            },
          ],
        };

  useEffect(() => {
    async function getForecast() {
      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tucker?unitGroup=us&include=days%2Ccurrent%2Chours&key=DAVPVUJTGGHRX93CDU7EB2NVS&contentType=json\n`
        );
        const data = await response.json();
        setForecast(data);
      } catch (error) {
        console.error(error);
      }
    }
    getForecast().then((r) => r);
  }, []);

  if (!forecast) {
    return <div>Loading forecast...</div>;
  }

  function formatDate(date) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    return `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
  }

  const today = new Date();
  const formatDay = new Date(today);
  formatDay.setDate(today.getDate() + selectedButton);
  const formattedDate = formatDate(formatDay);

  const handleButtonClick = (buttonIndex) => {
    setSelectedButton(buttonIndex);
  };

  return (
    <div>
      <div className={"button-row"}>
        <button
          className="date_button"
          style={{
            backgroundColor:
              selectedButton === 0 ? "rgb(129, 207, 250)" : "#262626",
            color: selectedButton === 0 ? "#262626" : "rgb(129, 207, 250)",
            fontWeight: selectedButton === 0 ? "700" : "500",
          }}
          onClick={() => handleButtonClick(0)}
        >
          {new Date().getDate()}
        </button>
        <button
          className="date_button"
          style={{
            backgroundColor: selectedButton === 1 ? "#F5F5F5FF" : "#262626",
            color: selectedButton === 1 ? "#262626" : "whitesmoke",
            fontWeight: selectedButton === 1 ? "700" : "500",
          }}
          onClick={() => handleButtonClick(1)}
        >
          {new Date().getDate() + 1}
        </button>
        <button
          className="date_button"
          style={{
            backgroundColor: selectedButton === 2 ? "#F5F5F5FF" : "#262626",
            color: selectedButton === 2 ? "#262626" : "whitesmoke",
            fontWeight: selectedButton === 2 ? "700" : "500",
          }}
          onClick={() => handleButtonClick(2)}
        >
          {new Date().getDate() + 2}
        </button>
        <button
          className="date_button"
          style={{
            backgroundColor: selectedButton === 3 ? "#F5F5F5FF" : "#262626",
            color: selectedButton === 3 ? "#262626" : "whitesmoke",
            fontWeight: selectedButton === 3 ? "700" : "500",
          }}
          onClick={() => handleButtonClick(3)}
        >
          {new Date().getDate() + 3}
        </button>
        <button
          className="date_button"
          style={{
            backgroundColor: selectedButton === 4 ? "#F5F5F5FF" : "#262626",
            color: selectedButton === 4 ? "#262626" : "whitesmoke",
            fontWeight: selectedButton === 4 ? "700" : "500",
          }}
          onClick={() => handleButtonClick(4)}
        >
          {new Date().getDate() + 4}
        </button>
        <button
          className="date_button"
          style={{
            backgroundColor: selectedButton === 5 ? "#F5F5F5FF" : "#262626",
            color: selectedButton === 5 ? "#262626" : "whitesmoke",
            fontWeight: selectedButton === 5 ? "700" : "500",
          }}
          onClick={() => handleButtonClick(5)}
        >
          {new Date().getDate() + 5}
        </button>
        <button
          className="date_button"
          style={{
            backgroundColor: selectedButton === 6 ? "#F5F5F5FF" : "#262626",
            color: selectedButton === 6 ? "#262626" : "whitesmoke",
            fontWeight: selectedButton === 6 ? "700" : "500",
          }}
          onClick={() => handleButtonClick(6)}
        >
          {new Date().getDate() + 6}
        </button>
        <div className="popup-date">{formattedDate}</div>
        <hr style={{ width: "100%" }}></hr>
      </div>
      <div className="temp_box">
        {graph === "temp" ? (
          <div>
            <div className="current_temp">
              <p className={"popup-temp"}>
                {Math.round(forecast["days"][selectedButton]["temp"])}°
              </p>
              <img
                className={"popup-icon"}
                src={require("./icons/" +
                  forecast["currentConditions"]["icon"] +
                  ".png")}
                alt={forecast["currentConditions"]["icon"]}
                style={{
                  width: "32px",
                  height: "32px",
                  alignItems: "center",
                  marginTop: "60px",
                  marginLeft: "-135px",
                  float: "right",
                }}
              />
            </div>
            <p style={{ textAlign: "left", marginTop: -60, padding: 5 }}>
              {" "}
              H: {Math.round(forecast["days"][selectedButton]["tempmax"])}° L:{" "}
              {Math.round(forecast["days"][selectedButton]["tempmin"])}°
            </p>
          </div>
        ) : null}
        {graph === "uvindex" ? (
          <div>
            <div className="current_temp">
              <p className="popup-temp">
                {forecast["days"][selectedButton]["uvindex"]}{" "}
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: 18,
                    width: "100%",
                    float: "right",
                    textAlign: "left",
                    marginTop: 18,
                    marginLeft: 10,
                  }}
                >
                  {" "}
                  {getUvLevel(forecast["days"][selectedButton]["uvindex"])}
                </span>
              </p>
            </div>
            <p
              style={{
                textAlign: "left",
                marginTop: -60,
                padding: 3,
                color: "#98989e",
              }}
            >
              World Health Organization UVI
            </p>
          </div>
        ) : null}
        {graph === "windspeed" ? (
          <div>
            <div className="current_temp">
              <p className="popup-temp">
                {Math.round(forecast["days"][selectedButton]["windspeed"])}{" "}
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: 18,
                    width: "100%",
                    float: "right",
                    textAlign: "left",
                    marginTop: 18,
                    marginLeft: 10,
                  }}
                >
                  {" "}
                  mph
                </span>
                <span style={{ paddingLeft: 10, color: "#98989e" }}>
                  {degToCompass(forecast["days"][selectedButton]["winddir"])}
                </span>
              </p>
            </div>
            <p
              style={{
                textAlign: "left",
                marginTop: -60,
                padding: 8,
                color: "#98989e",
              }}
            >
              Gusts: {Math.round(forecast["days"][selectedButton]["windgust"])}{" "}
              mph
            </p>
          </div>
        ) : null}
        {graph === "precip" ? (
          <div>
            <div className="current_temp">
              <p className="popup-temp">
                {Math.round(forecast["days"][selectedButton]["precip"])}
                {'"'}
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: 18,
                    width: "100%",
                    float: "right",
                    textAlign: "left",
                    marginTop: 18,
                    marginLeft: 10,
                  }}
                >
                  {" "}
                </span>
              </p>
            </div>
            <p
              style={{
                textAlign: "left",
                marginTop: -60,
                padding: 3,
                color: "#98989e",
              }}
            >
              Total for the day
            </p>
          </div>
        ) : null}
        {graph === "feelslike" ? (
          <div>
            <div className="current_temp">
              <p className="popup-temp">
                {Math.round(forecast["days"][selectedButton]["feelslike"])}°
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: 18,
                    width: "100%",
                    float: "left",
                    textAlign: "left",
                    marginTop: 18,
                    marginLeft: 10,
                  }}
                >
                  {" "}
                </span>
              </p>
            </div>
            <p
              style={{
                textAlign: "left",
                marginTop: -60,
                padding: 3,
                color: "#98989e",
              }}
            >
              Actual {Math.round(forecast["days"][selectedButton]["temp"])}°
            </p>
          </div>
        ) : null}
      </div>

      <div className="container">
        <DropdownComp />
        <br />
        <br />
        <br />
      </div>
      <div className="graph-box">
        <div className="icon-row">
          {forecast["days"][selectedButton]["hours"].map((hour, index) => {
            if (index % 2 === 0) {
              return (
                <>
                  {graph === "temp" ? (
                    <img
                      src={require("./icons/" + hour.icon + ".png")}
                      alt={"img"}
                      style={{ width: 15, height: 15 }}
                    />
                  ) : null}
                  {graph === "precip" ? (
                    <img
                      src={require("./icons/" + hour.icon + ".png")}
                      alt={"img"}
                      style={{ width: 15, height: 15 }}
                    />
                  ) : null}
                  {graph === "feelslike" ? (
                    <img
                      src={require("./icons/" + hour.icon + ".png")}
                      alt={"img"}
                      style={{ width: 15, height: 15 }}
                    />
                  ) : null}
                  {graph === "uvindex" ? (
                    <span style={{ marginLeft: 15, fontSize: 16 }}>
                      {hour["uvindex"]}
                    </span>
                  ) : null}
                  {graph === "windspeed" ? (
                    <img
                      src={require("./icons/windarrow.png")}
                      alt="windarrow"
                      style={{
                        rotate: hour["winddir"] + "deg",
                        width: 16,
                        height: "auto",
                      }}
                    />
                  ) : null}
                </>
              );
            } else {
              return null; // skip the odd hours
            }
          })}
        </div>
        <div>
          <div>{forecast && <CanvasJSChart options={options} />}</div>
        </div>
      </div>
    </div>
  );
}

export default PopupHTMLTop;
