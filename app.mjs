import express from 'express';
import cors from 'cors';
import axios from 'axios';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;

// OpenWeatherMap API key
const apiKey = '';

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Define a route handler for handling POST requests to /api/city
app.post('/api/city', (req, res) => {
  const { city, email } = req.body;
  console.log('Received city:', city);
  console.log('Received email:', email);

  // Fetch weather forecast for the specified city
  fetchWeatherForecast(city)
    .then(forecastData => {
      // Analyze forecast data to determine if conditions are severe
      const isSevere = checkForSevereWeather(forecastData);

      // If weather conditions are severe, send email alert
      if (isSevere) {
        sendEmail(email, city, forecastData);
      }

      res.status(200).json({ message: 'City and email received successfully' });
    })
    .catch(error => {
      console.error("Error fetching weather forecast:", error);
      res.status(500).json({ error: 'Error fetching weather forecast' });
    });
});

// Function to fetch weather forecast for the specified city
function fetchWeatherForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  return axios.get(apiUrl)
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching weather forecast:", error);
      throw new Error("Error fetching weather forecast");
    });
}

// Function to analyze forecast data and determine if conditions are severe
function checkForSevereWeather(forecastData) {

  const severeDays = forecastData.list.some(item => {
    const temperature = item.main.temp;
    const windSpeed = item.wind.speed;
    const rainfall = (item.rain && item.rain['3h']) || 0; // Rainfall in the last 3 hours, if available

    return temperature > 35 || windSpeed > 50 || rainfall > 50;
  });

  return severeDays;
}

// Function to send email alert
function sendEmail(email, city, forecastData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'prathamtemp101@gmail.com', 
      pass: '' 
    }
  });

  const mailOptions = {
    from: 'prathamtemp101@gmail.com', 
    to: email,
    subject: 'Severe Weather Alert',
    html: `
      <h1>Severe Weather Alert</h1>
      <p>Severe weather conditions have been detected in ${city}.</p>
      <p>For more details, please check the weather forecast.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred while sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
