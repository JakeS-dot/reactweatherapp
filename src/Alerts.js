import React, { useEffect, useState } from "react";

function Alerts() {
  const [forecast, setForecast] = useState(null);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const formattedAlerts = forecast["alerts"].map((alert) => {
    const capitalizedEvent = alert["event"]
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const formattedTime = timeFormatter.format(new Date(alert["ends"]));

    return `${capitalizedEvent} until ${formattedTime}`;
  });

  const alertsString = formattedAlerts.join("\n");

  useEffect(() => {
    async function getForecast() {
      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tucker?unitGroup=us&include=alerts&key=DAVPVUJTGGHRX93CDU7EB2NVS&contentType=json`
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
    return <div>Loading...</div>;
  }
  if (forecast["alerts"] === null) {
    return <div>Loading...</div>;
  }

  if (!forecast) {
    return <div></div>;
  } else {
    return (
      <div className={"black-box"}>
        <div className="line_stick">
          <h3 className="line_text">Weather Alerts</h3>
          <div
            style={{
              float: "left",
              paddingLeft: 10,
              marginTop: 0,
              marginBottom: 5,
              whiteSpace: "pre-wrap",
            }}
          >
            {alertsString}
          </div>
        </div>
      </div>
    );
  }
}

export default Alerts;
