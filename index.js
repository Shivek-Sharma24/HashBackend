const express = require("express");
const app = express();
const port = 4000;
const router = express.Router();
const bodyparser = require("body-parser");

app.use(express.json());
const bcrypt = require("bcrypt");
const cors = require("cors");
app.use(
  cors({
    origin: "https://hash-frontend-nu.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // if you're using specific methods
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyparser.json());
app.use("/", router);

// const Saltrounds = 12;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});

router.get("/", function (req, res) {
  res.send("server running successfully");
});

router.post("/compare", async function (req, res) {
  let { BcryptVal, OriginalVal } = req.body;

  try {
    let ismatch = await bcrypt.compare(OriginalVal, BcryptVal);

    if (!ismatch) {
      res.json({ message: false });
    } else {
      res.json({ message: true });
    }
  } catch (error) {
    console.log("compare route error", error);
  }
});

router.post("/generate", async function (req, res) {
  const salt = parseInt(req.body.Saltval);
  try {
    let result = await bcrypt.hash(req.body.hashPassword, salt);
    if (result) {
      res.json({ hashPassword: result, round: salt });
    } else {
      res.json({ message: "password hashing failure" });
    }
  } catch (error) {
    console.log("some error in generate route", error);
  }
});

module.exports = app;
