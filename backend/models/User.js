const { Schema, model } = require("mongoose");

const userShema = Schema(
  {
    userName: {
      type: String,
      required: false,
      default: "John Doe",
    },

    userEmail: {
      type: String,
      required: [true, "DB: Please add email"],
    },

    userPassword: {
      type: String,
      required: [true, "DB: Please add password"],
    },
    token: {
      type: String,
      required: false,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("user", userShema);
