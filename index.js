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
  //Get a random record, courtesy of: https://stackoverflow.com/questions/2824157/random-record-from-mongodb
  const result = await collection
    .aggregate([{ $match: { verified: true } }, { $sample: { size: 1 } }])
    .toArray(); //Convert the result into array form. Courtesy of: https://stackoverflow.com/a/60029466

  console.log(
    `Just responded to a GET request with quote ${result[0].quote} and author ${result[0].author}`
  );

  res.status(200).send({
    quote: result[0].quote,
    author: result[0].author,
  });
}

//Todo: Store data into DB when receiving a post request with verified bool set to FALSE by default.
// Also, double-check db schema to ensure this is scalable when allowing any random joe to POST a quote to our DB.
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
