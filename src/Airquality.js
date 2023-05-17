import React, { useEffect, useState } from "react";

function AirQuality() {
  const [data, setData] = useState(null);

  useEffect(() => {
      fetch(
      "https://api.airvisual.com/v2/nearest_city?lat=33.853729&lon=-84.214592&key=a36b89fd-9395-4fe3-84e4-1eefc6d82ce1"
    )
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  let aqi;
  if (data.data.current["pollution"]["aqius"]) {
    const aqius = data.data.current["pollution"]["aqius"];
    if (aqius < 50) {
      aqi = "Good";
    } else if (aqius < 100) {
      aqi = "Moderate";
    } else if (aqius < 150) {
      aqi = "Unhealthy for Sensitive Groups";
    } else if (aqius < 200) {
      aqi = "Unhealthy";
    } else if (aqius < 300) {
      aqi = "Very Unhealthy";
    } else {
      aqi = "Hazardous";
    }
  } else {
    aqi = "Unknown";
  }

  return (
    <div>
      {data ? (
        <div>
          <img
            src={require("./icons/air-quality.png")}
            alt="quality"
            className="aqi-image"
          />
          <p style={{ textAlign: "left", padding: "10px" }}>Air Quality</p>
          <p
            style={{
              textAlign: "left",
              paddingLeft: "15px",
              fontSize: "20px",
            }}
          >
            {data.data.current["pollution"]["aqius"]} - {aqi}
          </p>
          <p className={"aqi-text"}>
            Air quality index is {data.data.current["pollution"]["aqius"]},
            which is '{aqi}' on the AQI U.S Scale.
          </p>
          <div className="aqi-grad">
            <div
              style={{
                marginLeft: data.data.current["pollution"]["aqius"],
              }}
              className="aqi-circ"
            ></div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AirQuality;
