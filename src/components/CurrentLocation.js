import { useEffect, useState } from "react";
import { key, base } from "./ApiKeys";
import ReactAnimatedWeather from "react-animated-weather";
import Forcast from "./forcast";
import Clock from "react-live-clock";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};
const defaults = {
  icon: "CLEAR_DAY",
  color: "white",
  size: 112,
  animate: true,
};

const CurrentLocation = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [temperatureC, setTemperatureC] = useState("");
  const [temperatureF, setTemperatureF] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [humidity, setHumidity] = useState("");
  const [description, setDescription] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [main, setMain] = useState("");
  let [icon, setIcon] = useState("CLEAR_DAY");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        }
      );
    } else {
      alert("Geolocation not available");
    }
  }, []);

  let getWeather = async (lat, lon) => {
    const result = await fetch(
      `${base}weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
    );
    const data = await result.json();
    setLatitude(lat);
    setLongitude(lon);
    setCity(data.name);
    setTemperatureC(Math.round(data.main.temp));
    setTemperatureF(Math.round(data.main.temp * 1.8 + 32));
    setHumidity(data.main.humidity);
    setMain(data.weather[0].main);
    setCountry(data.sys.country);
    switch (data.weather[0].main) {
      case "Haze":
        setIcon("CLEAR_DAY");
        break;
      case "Clouds":
        setIcon("CLOUDY");
        break;
      case "Rain":
        console.log(main);
        setIcon("RAIN");
        break;
      case "Snow":
        console.log(main);
        setIcon("SNOW");
        break;
      case "Dust":
        setIcon("WIND");
        console.log(main);
        break;
      case "Drizzle":
        setIcon("SLEET");
        break;
      case "Fog":
        setIcon("FOG");
        break;
      case "Smoke":
        setIcon("FOG");
        break;
      case "Tornado":
        setIcon("WIND");
        break;
      default:
        console.log(main);
        setIcon("CLEAR_DAY");
    }
  };

  if (temperatureC) {
    return (
      <>
        <div className="city">
          <div className="title">
            <h2>{city}</h2>
            <h3>{country}</h3>
          </div>
          <div className="mb-icon">
            {" "}
            <ReactAnimatedWeather
              icon={icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {temperatureC}°<span>C</span>
              </p>
            </div>
          </div>
        </div>
        <Forcast icon={icon} weather={main} />
      </>
    );
  } else {
    return (
      <>
        <div className="intro">
          <h3 className="initial">Detecting your location</h3>
          <h3 className="initial">
            Your current location wil be displayed on the App <br></br> & used
            for calculating Real time weather.
          </h3>
        </div>
      </>
    );
  }
};

export default CurrentLocation;
