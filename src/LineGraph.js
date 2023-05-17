import React, { useEffect, useState } from "react";
import CanvasJSReact from "./canvasjs.react";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function LineChart() {
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

  let hoursData = null;
  if (
    forecast &&
    forecast["days"] &&
    forecast["days"][0] &&
    forecast["days"][0]["hours"]
  ) {
    hoursData = forecast["days"][0]["hours"].map((hour, index) => ({
      x: index,
      y: hour["temp"],
    }));
  }

  const options = {
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
        toolTipContent: "Temperature: {y}°F",
        dataPoints: hoursData,
      },
    ],
  };

  return <div>{forecast && <CanvasJSChart options={options} />}</div>;
}

export default LineChart;
