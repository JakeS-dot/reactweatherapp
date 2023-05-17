import React, { useEffect, useState } from "react";

function WindPrecip() {
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
  const winddir = forecast["days"].map((day) => day["winddir"]);
  return (
    <div className={"square-box"} id={"wind"}>
      <div className="wind-circ">
        <img
          src={require("./icons/arrow.png")}
          alt="wind"
          className={"wind-img"}
          style={{ transform: `rotate(${winddir}deg)` }}
        />
        <p className="wind-mph">
          <span id="metric" style={{ margin: 0 }}>
            {forecast["currentConditions"]["windspeed"]} mph
          </span>
        </p>
      </div>
    </div>
  );
}

export default WindPrecip;
