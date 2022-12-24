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

//// Учим считывать  body ////
app.use(express.json());
//// Учим считывать  forms ////
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/films", require("./routes/filmsRoutes"));

const { response } = require("express");
// registration - сохранение пользователя в базе данных//
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { log } = require("console");

app.post(
  "/register",
  (req, res, next) => {
    console.log("Сработал Joi");
    next();
  },
  async (req, res) => {
    // console.log(req.body);
    //делаем валидацию полей в контролере
    const { userName, userEmail, userPassword } = req.body;
    if (!userEmail || !userPassword) {
      return res.status(400).json({
        code: 400,
        message: "Please add fildes",
      });
    }

    // делаем поиск пользователя в базе
    // если пользователь есть в базе - иди и логинься
    const candidate = await User.findOne({ userEmail });
    if (candidate) {
      return res.status(409).json({
        code: 409,
        message: "User already exist. Please login",
      });
    }
    // если пользователя нет хэшируем пароль

    const hashPassword = await bcrypt.hash(userPassword, 5);

    // сохраняем пользвателя в базе данных
    const user = await User.create({ ...req.body, userPassword: hashPassword });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Unable to save to DB",
      });
    }
    return res.status(201).json({
      code: 201,
      message: "Registration success",
      data: user.userEmail,
    });
  }
);

// Логин, аутетнификация-проверка данных пользователя с хранящимися в базе

app.post("/login", async (req, res) => {
  // валидируем поля
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword) {
    return res.status(400).json({
      code: 400,
      message: "Please add fildes",
    });
  }

  // ищем пользователя в базе даных по уникальному полю
  const user = await User.findOne({ userEmail });
  if (!user) {
    return res.status(400).json({
      code: 400,
      message: "Unable to find user in DB",
    });
  }
  // console.log(user);
  // расшифровываем пароль
  const validPassord = await bcrypt.compare(userPassword, user.userPassword);
  if (!validPassord) {
    return res.status(400).json({
      code: 400,
      message: "Invalid login or password",
    });
  }
  // если все ОК выдаем токен
  const token = generateToken(user._id);
  user.token = token;
  await user.save();
  // console.log(token);
  if (!user.token) {
    return res.status(400).json({
      code: 400,
      message: "Unaible save token",
    });
  }
  const userInfo = {
    email: user.userEmail,
    token: user.token,
  };
  return res.status(200).json({
    code: 200,
    message: "Login success",
    data: userInfo,
  });
});

const authMidleware = require("./midlewares/authMidleware");

app.get("/logout", authMidleware, async (req, res) => {
  // пользователь залогинен, имеет валидный токен
  // console.log(req.user);
  // расшифровываем токен по ID пользователя
  // if (!req.user) {
  //   return res.status(400).json({
  //     code: 400,
  //     message: "Unable to request user",
  //   });
  // }
  const user = await User.findById(req.user._id);
  // if (!user) {
  //   return res.status(400).json({
  //     code: 400,
  //     message: "Unaible to find user",
  //   });
  // }

  user.token = null;
  await user.save();
  console.log(user);
  // if (user.token) {
  //   return res.status(400).json({
  //     code: 400,
  //     message: "Unaible to logout",
  //   });
  // }
  res.status(200).json({
    code: 200,
    message: "Logout success",
  });

  // set token null
});

function generateToken(ID) {
  const payload = { ID };
  return jwt.sign(payload, "pizza", { expiresIn: "8h" });
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`.cyan.bold.italic),
    connectDB();
});
