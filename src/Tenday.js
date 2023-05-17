import React, { useState, useEffect } from "react";
import PopupHTMLTop from "./Popup";
import "./App.css";
import "./popup.css";

function Popup({ isOpen, onClose }) {
  const popupContent = (
    <div className="hid-box">
      <button className="close-button" onClick={onClose}>
        x
      </button>
      <PopupHTMLTop />
    </div>
  );

  return (
    <div
      className={`popup-container ${isOpen ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {isOpen && popupContent}
    </div>
  );
}

function Tenday() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.style.backgroundColor = isOpen ? "rgba(0, 0, 0, 1)" : "black";
    body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "unset";
    }
  }, [isOpen]);

  const [tenday, setTenday] = useState(null);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  function getDayOfWeek(dateString) {
    let dateParts = dateString.split("-");
    let year = dateParts[0];
    let month = dateParts[1].padStart(2, "0");
    let day = dateParts[2].padStart(2, "0");
    let formattedDate = `${year}-${month}-${day}`;
    let date = new Date(formattedDate);
    return daysOfWeek[date.getDay()];
  }

  useEffect(() => {
    async function getForecast() {
      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tucker?unitGroup=us&include=days%2Ccurrent%2Chours&key=DAVPVUJTGGHRX93CDU7EB2NVS&contentType=json\n`
        );
        const data = await response.json();
        setTenday(data);
      } catch (error) {
        console.error(error);
      }
    }
    getForecast().then((r) => r);
  }, []);

  if (!tenday) {
    return <div>Loading forecast...</div>;
  }

  return (
    <div>
      <div className="line_stick">
        <p className="line_text">
          <img
            className={"cal-img"}
            src={require("./icons/calendar.jpg")}
            alt={"img"}
          />
          10-Day Forecast
        </p>
        <hr className="line" />
      </div>
      <table>
        <tbody>
          {tenday["days"].map((forecast) => (
            <tr
              key={forecast.datetime}
              className={"tr_tenday"}
              onClick={togglePopup}
            >
              <td key={forecast.datetime} className="tdtext">
                {getDayOfWeek(forecast.datetime)}
              </td>
              <td key={forecast.icon}>
                <div className="icon">
                  <img
                    style={{ width: 50 }}
                    src={require("./icons/" + forecast.icon + ".png")}
                    alt={"img"}
                  />
                  {Math.round(forecast["precipprob"] / 10) * 10 !== 0 && (
                    <div className="text">
                      {Math.round(forecast["precipprob"] / 10) * 10 + "%"}
                    </div>
                  )}
                </div>
              </td>
              <td className={"min-temp"} key={forecast["tempmin"]}>
                {Math.round(forecast["tempmin"])}°
              </td>
              <td key={forecast}>
                <div
                  style={{
                    background: `linear-gradient(to left, rgb(${
                      forecast["tempmax"] * 2
                    }, 230, ${forecast["tempmin"]}), rgb(0, ${
                      forecast["tempmin"] * 2
                    }, 200)`,
                  }}
                  className="temp-range"
                ></div>
              </td>

              <td key={forecast["tempmax"]}>
                {Math.round(forecast["tempmax"])}°
              </td>
            </tr>
          ))}
        </tbody>
        <Popup isOpen={isOpen} onClose={togglePopup} />
      </table>
    </div>
  );
}
export default Tenday;
