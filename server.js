const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const app = require("./app");

const DB = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  // console.log("DB connected");
});

const port = process.env.PORT;
app.listen(port, () => {
  // console.log(`App running on port ${port}...`);
});
