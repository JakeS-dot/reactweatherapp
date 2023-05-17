import "./App.css";
import WeatherInfo from "./Topinfo";
import ErrorBoundary from "./ErrorCatch";
import HourlyForecast from "./Hourly";
import Tenday from "./Tenday";
import AirQuality from "./Airquality";
import UvSun from "./UvSun";
import React from "react";
import WindPrecip from "./WindPrecip";
import Alerts from "./Alerts";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ErrorBoundary>
          <WeatherInfo />
        </ErrorBoundary>
        <ErrorBoundary>
          <Alerts />
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="hourly">
            <HourlyForecast />
          </div>
        </ErrorBoundary>

        <div className="tp">
          <ErrorBoundary>
            <div className="tenday">
              <Tenday />
            </div>
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="black-box">
              <AirQuality />
            </div>
          </ErrorBoundary>

          <div className="black-box">
            <p>
              <img
                className={"cal-img"}
                src={require("./icons/umbrella.png")}
                alt={"img"}
                style={{
                  width: "12px",
                  height: "auto",
                  marginLeft: 5,
                  marginBottom: 2,
                }}
              />
              Precipitation
            </p>
            <iframe
              width="300"
              height="300"
              title={"precip"}
              src="https://embed.windy.com/embed2.html?lat=33.858&lon=-84.216&detailLat=33.858&detailLon=-84.216&width=300&height=300&zoom=5&level=surface&overlay=radar&product=radar&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
            ></iframe>
          </div>
        </div>
        <ErrorBoundary>
          <UvSun />
        </ErrorBoundary>
        <ErrorBoundary>
          <WindPrecip />
        </ErrorBoundary>
      </header>
    </div>
  );
}

export default App;
