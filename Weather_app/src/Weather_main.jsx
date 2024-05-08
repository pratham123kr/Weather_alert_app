import { useState, useEffect } from 'react';
import './App.css';
import { signOut } from "firebase/auth";
import { auth } from  './FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

function Weather_main() {
  const api = {
    key: 'e0b8005ffc02c2ba82891029f85d60c3',
    base: "https://api.openweathermap.org/data/2.5/",
  }

  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserEmail(user.email);
        const lastSearch = localStorage.getItem(user.email);
        if (lastSearch) {
          setSearch(lastSearch);
          searchWeatherData(lastSearch);
        }
      } else {
        setUserEmail('');
      }
    });
    return () => unsubscribe();
  }, []);

  const searchWeatherData = (location) => {
    fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then((result) => {
        setWeather(result);
      })
      .catch(error => console.error('Error fetching weather data:', error));

    fetch(`${api.base}forecast?q=${location}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then((result) => {
        // Group the forecast data by date
        const groupedForecast = {};
        result.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!groupedForecast[date]) {
            groupedForecast[date] = [];
          }
          groupedForecast[date].push(item);
        });
        setForecast(groupedForecast);
      })
      .catch(error => console.error('Error fetching forecast data:', error));
  }

  const handleSearch = () => {
    // Send city data and user email to backend
    axios.post('http://localhost:3000/api/city', { city: search, email: userEmail })
      .then(response => {
        console.log('City data sent to backend:', response.data);
      })
      .catch(error => {
        console.error('Error sending city data to backend:', error);
      });

    searchWeatherData(search);
    // Save the last searched place to local storage
    localStorage.setItem(userEmail, search);
  }

  const handleClick = () => {
    signOut(auth).then(() => {
      // localStorage.removeItem(userEmail); // Remove the saved search on logout
      navigate('/');
    }).catch(error => console.error('Error signing out:', error));
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* TOP NAVIGATION BAR */}
        <nav className="top-nav">
          <div className="user-email">{userEmail}</div>
          <button onClick={handleClick}>Sign Out</button>
        </nav>

        {/* SEARCH BAR */}
        <div className="search-bar">
          <input
            type='text'
            placeholder='Search...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* CURRENT WEATHER */}
        {typeof weather.main !== "undefined" ? (
          <div className="weather-details">
            <p>{weather.name}</p>
            <p>Current Temperature: {weather.main.temp}°C</p>
            <div>
              <p>{weather.weather[0].main}</p>
              <p>({weather.weather[0].description})</p>
            </div>
          </div>
        ) : (
          <div className="weather-details">
            <p>Location Name</p>
            <p>Temp in °C</p>
            <p>Weather Conditions</p>
          </div>
        )}

        {/* FORECAST */}
        <div className="forecast">
          {Object.keys(forecast).map(date => (
            <div key={date} className="forecast-item">
              <p>Date: {date}</p>
              <div className="forecast-hourly">
                {forecast[date].map((item, index) => (
                  <div key={index} className="hourly-item">
                    <p>Time: {item.dt_txt.split(' ')[1]}</p>
                    <p>Temperature: {item.main.temp}°C</p>
                    <div>
                      <p>{item.weather[0].main}</p>
                      <p>({item.weather[0].description})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  )
}

export default Weather_main;
