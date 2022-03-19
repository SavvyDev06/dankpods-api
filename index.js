const express = require("express");
const app = express();
const PORT = 8080;

//Dotenv for credential management
const dotenv = require("dotenv").config();

//MongoDB
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGOCLIENT_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  const collection = client.db("dankpods-api").collection("quotes");
  // perform actions on the collection object
  client.close();
});

app.use(express.json());

app.get("/dank", (req, res) => {
  console.log("pods");
  res.status(200).send({
    quote: "dingus",
    author: "dankmus",
  });
});

app.post("/quote/:id", (req, res) => {
  const { id } = req.params;
  const { quote, author } = req.body;

  if (!quote) {
    res.status(418).send({ message: "We need a quote!" });
  } else if (!author) {
    res.status(418).send({ message: "We need an author!" });
  } else {
    res.send({
      message: `Your quote ${quote} by ${author} has been submitted with an ID of ${id}!`,
    });
  }
});

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
