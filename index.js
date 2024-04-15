import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url))
const apiAddress = "https://api.openweathermap.org/data/2.5/weather";
const appId = process.env.API_KEY;
//console.log(appId)

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")

});

app.post("/weather", async (req, res) => {
  try {
    const response = await axios.get(apiAddress, {
      params: {
        q: req.body["input"],
        appid: appId,
      },
    });
    //console.log(req.body["input"]);
    res.render("index.ejs", {
      content: {
        city: response.data.name,
        country: response.data.sys.country,
        description: response.data.weather[0].main,
        temp: Math.floor(response.data.main.temp - 273.15),
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
