import React, { useEffect, useState } from "react";

function WeatherInfo() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tucker/today?unitGroup=us&include=current&key=DAVPVUJTGGHRX93CDU7EB2NVS&contentType=json"
    )
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error(error));
  }, []);

  if (!weather) {
    return <div>Loading weather information...</div>;
  }

  return (
    <div className="top">
      <div className="location">{weather.address}</div>
      <div className="temp">
        {Math.round(weather["currentConditions"]["temp"])}°
      </div>
      <div className="conditions">
        Conditions: {weather["currentConditions"]["conditions"]}
      </div>
      <div className="conditions">
        High: {Math.round(weather["days"][0]["tempmax"])}° Low:{" "}
        {Math.round(weather["days"][0]["tempmin"])}°
      </div>
    </div>
  );
}

export default WeatherInfo;
