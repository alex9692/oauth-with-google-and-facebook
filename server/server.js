const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");

dotenv.config({ path: "./.env" });

const app = require("./app");

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Database connected successfully!");
  });

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server connected to PORT: ", PORT);
});
