const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    const db = await connect(process.env.MONGO_DB);
    console.log(
      `MongooDB is connected db.name: ${db.connection.name} on host:${db.connection.host}, on port:${db.connection.port} `
        .cyan.bold.italic
    );
  } catch (error) {
    console.log(error.message.red.bold);
    process.exit(1);
  }
};
module.exports = connectDB;
// const Cat = mongoose.model("Cat", { name: String });

// const kitty = new Cat({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));
