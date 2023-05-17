import React, { useEffect, useState } from "react";

function convertTime(time) {
  time = time.slice(0, -3);
  const [hours, minutes] = time.split(":");

  // Convert hours to standard time
  let standardHours = parseInt(hours, 10);
  let timeOfDay = "AM";
  if (standardHours > 12) {
    standardHours -= 12;
    timeOfDay = "PM";
  } else if (standardHours === 12) {
    timeOfDay = "PM";
  } else if (standardHours === 0) {
    standardHours = 12;
  }

  // Return the standard time string
  return `${standardHours}:${minutes} ${timeOfDay}`;
}

function getUv(data) {
  const uv = data["currentConditions"]["uvindex"];
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

function UvSun() {
  const [forecast, setForecast] = useState(null);

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
    return <div>Loading weather information...</div>;
  }
  return (
    <div>
      <div id="uv" className="square-box">
        <p style={{ padding: 0 }} className="line_text">
          <img
            className={"cal-img"}
            src={require("./icons/uv.png")}
            alt={"img"}
            style={{
              width: "auto",
              height: 20,
            }}
          />
          U.V Index{" "}
        </p>
        <p
          style={{
            textAlign: "left",
            fontSize: 24,
            marginBottom: 0,
          }}
        >
          {/*{forecast["currentConditions"]["uvindex"]}*/}
          11
        </p>
        <p
          style={{
            textAlign: "left",
            fontSize: 20,
            marginTop: "0",
            fontWeight: "lighter",
          }}
        >
          {/*{getUv(forecast)}*/}
          Very High
        </p>

        <div className="uv-grad">
          <div
            style={{
              // marginLeft: 2 + forecast["currentConditions"]["uvindex"] * 10,
              marginLeft: 2 + 11 * 10,
            }}
            className="aqi-circ"
          ></div>
        </div>
      </div>

      <div className="square-box" id="sun">
        <p
          style={{ padding: 0, margin: 5, marginTop: 16 }}
          className="line_text"
        >
          <img
            className={"cal-img"}
            src={require("./icons/sunset.png")}
            alt={"img"}
            style={{
              width: "18px",
              height: "auto",
              marginLeft: 0,
              marginBottom: 4,
            }}
          />
          Sunrise/Sunset <br />
          <br />
          <br />
        </p>
        <p
          style={{
            textAlign: "left",
            fontSize: 18,
            marginTop: "0",
            fontWeight: "lighter",
            padding: "5px,5px,0,5px",
          }}
        >
          {/*{forecast["currentConditions"]["sunrise"].slice(0, -3).substring(1)}{" "}*/}
          7:25 AM | Sunrise
          <br />
          <div className="sun-grad"></div>
          {/*{convertTime(forecast["currentConditions"]["sunset"])} | Sunset*/}
          8:53 PM | Sunset
        </p>
      </div>
    </div>
  );
}

export default UvSun;
