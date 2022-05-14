const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zugul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("doctorsPortal").collection("services");
    const appointmentCollection = client
      .db("doctorsPortal")
      .collection("appointments");

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/appointment", async (req, res) => {
      const appointmentData = req.body;
      const query = {
        treatmentId: appointmentData.treatmentId,
        date: appointmentData.date,
        patientEmail: appointmentData.patientEmail,
      };
      const exist = await appointmentCollection.findOne(query);
      if (exist) {
        return res.send({ success: false, appointment: exist });
      }
      const result = await appointmentCollection.insertOne(appointmentData);
      res.send({ success: true, result });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("doctors portal running");
});
app.listen(port, () => {
  console.log("listen from ", port);
});
