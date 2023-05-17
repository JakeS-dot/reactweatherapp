import React, { useEffect, useState } from "react";
import "./graph.css";
import LineGraph from "./LineGraph";
function Graph() {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    async function getForecast() {
      const response = await fetch(
        "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tucker%2C%20GA?unitGroup=us&include=days%2Ccurrent%2Chours&key=DAVPVUJTGGHRX93CDU7EB2NVS&contentType=json\n"
      );

      const data = await response.json();
      setForecast(data);
    }
    getForecast().then((r) => r);
  }, []);

  if (!forecast) {
    return <div>Loading forecast...</div>;
  }

  return (
    <div className="graph-box">
      <div className="icon-row">
        {forecast["days"][0]["hours"].map((hour, index) => {
          if (index % 2 === 0) {
            return (
              <img
                src={require("./icons/" + hour.icon + ".png")}
                alt={"img"}
                style={{ width: 15, height: 15 }}
              />
            );
          } else {
            return null; // skip the odd hours
          }
        })}
      </div>
      <div>
        <LineGraph />
      </div>
    </div>
  );
}

export default Graph;
