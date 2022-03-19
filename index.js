const express = require("express");
const app = express();
const PORT = 8080;

//Dotenv for credential management
const dotenv = require("dotenv").config();

//MongoDB
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGOCLIENT_URI;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

mongoClient.connect();
console.log("Connected successfully to MongoDB server");
const db = mongoClient.db("dankpods-api");
const collection = db.collection("quotes");

//...end of MongoDB

app.use(express.json());

app.get("/dank", (req, res) => {
  console.log("Sending quote!");

  getQuote(res);
});

async function getQuote(res) {
  const result = await collection
    .aggregate([{ $match: { verified: true } }])
    .toArray();

  console.log(result[0].quote);

  res.status(200).send({
    quote: result[0].quote,
    author: result[0].author,
  });
}

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
