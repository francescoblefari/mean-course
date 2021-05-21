const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const app = express();
const uri =
  "mongodb+srv://francesco:" +
  process.env.MONDO_ATLAS_PW +
  "@cluster0.txcrp.mongodb.net/angular-node?retryWrites=true&w=majority";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

var posts = [
  {
    id: "fad12345",
    title: "Primo post",
    content: "Primo contenuto",
  },
  {
    id: "fad12335",
    title: "Secondo post",
    content: "Secondo contenuto",
  },
];

/**
 * user db: francesco
 * passwd db: KR3HjGJz6i21uoZV
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

/**
 * c'è ubn problema in quanto
 * mi stampa due volte il mio primo.
  app.use((req, res, next) => {
    res.send('Hello from express!');
  });
*/

//per esportare l'app si usa:
module.exports = app;
