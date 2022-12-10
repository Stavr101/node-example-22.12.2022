const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const connectDB = require("../config/db");
const configPath = path.join(__dirname, "..", "config", ".env");
require("colors");

/////load config///

dotenv.config({ path: configPath });

////////

// const filmsRoutes = require("./routes");
const app = express();
app.use("/api/v1/films", require("./routes/filmsRoutes"));
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`.cyan.bold.italic),
    connectDB();
});
