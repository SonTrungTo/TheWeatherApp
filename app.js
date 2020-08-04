const express   = require("express");
const {resolve} = require("path");
const bodyParser = require("body-parser");
const request   = require("request");

const app = express();
const apiKey = "c63a8baf76fdc40e38124f6e28ef6752";

app.use(express.static(resolve(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));

app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {weather:null, error: null});
});

app.post("/", (req, res, next) => {
  let city = req.body.city;
  let url  = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  request(url, (err, response, body) => {
    if (err) {
      res.render("index", {weather: null, error: "OOPS! Something is wrong!"});
      return;
    }
    let forecast = JSON.parse(body);
    if (forecast.main == undefined) {
      res.render("index", {weather: null, error: "OOPS! Wrong input!"});
      return;
    }
    let weather = {
      city: forecast.name,
      temperature: forecast.main.temp,
      country: forecast.sys.country,
      situation: forecast.weather[0].description,
      icon: forecast.weather.icon,
      humidity: forecast.main.humidity
    };
    let textWeather = `We are in ${weather.city}, ${weather.country}. It is
now ${weather.temperature} degree Celsius, ${weather.situation} and the humidity is ${weather.humidity}.`;
    res.render("index", {weather: textWeather, error: null});
  });
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(3000);
