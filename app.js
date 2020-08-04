const express   = require("express");
const {resolve} = require("path");
const bodyParser = require("body-parser");
const request   = require("request");
require("dotenv").config();

const app = express();
const apiKey = process.env.REACT_APP_WEATHER_API_KEYS;

app.use(express.static(resolve(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));

app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index"); // , {weather:null, error: null}
});


app.get(/^\/(.*)$/, (req, res, next) => {
  let city = req.params[0].trim();
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, (err, response , body) => {
    if (err) {
      next();
      return;
    }
    let forecast = JSON.parse(body);
    if (forecast.main == undefined) {
      next();
      return;
    }
    res.json({
      city: forecast.name,
      temperature: forecast.main.temp,
      country: forecast.sys.country,
      situation: forecast.weather[0].description,
      icon: forecast.weather[0].icon,
      humidity: forecast.main.humidity
    });
  });
});
// app.post("/", (req, res) => {
//   let city = req.body.city;
//   let url  = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
//   request(url, (err, response, body) => {
//     if (err) {
//       res.render("index", {weather: null, error: "OOPS! Something is wrong!"});
//       return;
//     }
//     let forecast = JSON.parse(body);
//     if (forecast.main == undefined) {
//       res.render("index", {weather: null, error: "OOPS! Wrong input!"});
//       return;
//     }
//     let weather = {
//       city: forecast.name,
//       temperature: forecast.main.temp,
//       country: forecast.sys.country,
//       situation: forecast.weather[0].description,
//       icon: forecast.weather.icon,
//       humidity: forecast.main.humidity
//     };
//     let textWeather = `We are in ${weather.city}, ${weather.country}. It is
// now ${weather.temperature} degree Celsius, ${weather.situation} and the humidity is ${weather.humidity}.`;
//     res.render("index", {weather: textWeather, error: null});
//   });
// });

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(process.env.PORT);
