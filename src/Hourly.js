import React, { useEffect, useState } from "react";
import PopupHTMLTop from "./Popup";

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
function HourlyForecast() {
  const [isOpen, setIsOpen] = useState(false);
  const [forecast, setForecast] = useState(null);

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

  useEffect(() => {
    async function getForecast() {
      const response = await fetch(
        "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tucker/today?unitGroup=us&include=current%2Chours&key=DAVPVUJTGGHRX93CDU7EB2NVS&contentType=json"
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
    <div>
      <div className="line_stick">
        <p className="line_text" style={{ position: "sticky" }}>
          {forecast["days"][0].description}
        </p>

        <hr className="line" />
      </div>
      <table>
        <thead></thead>
        <tbody onClick={togglePopup}>
          <tr>
            {forecast["days"].map((day) =>
              day["hours"].map((hour, index) => (
                <td key={index}>{convertTime(hour.datetime)}</td>
              ))
            )}
          </tr>
          <tr>
            {forecast["days"].map((day) =>
              day["hours"].map((hour, icon) => (
                <td key={icon}>
                  <img
                    src={require("./icons/" + hour.icon + ".png")}
                    alt={"img"}
                  />
                </td>
              ))
            )}
          </tr>
          <tr>
            {forecast["days"].map((day) =>
              day["hours"].map((hour, temp) => (
                <td key={temp}>{Math.round(hour["temp"])}°</td>
              ))
            )}
          </tr>
        </tbody>
        <Popup isOpen={isOpen} onClose={togglePopup} />
      </table>
    </div>
  );
}

export default HourlyForecast;
