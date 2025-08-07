const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

// Get all posts
app.get("/post", (req, res) => {
  res.status(200).send(posts);
});

// Create a new post
app.post("/post", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  try {
    console.log("Sending event to http://localhost:4005/events"); // ✅ Logging
    await axios.post("http://localhost:4005/events", {
      type: "PostCreated",
      data: { id, title },
    });
  } catch (err) {
    console.error("Error sending event to event-bus:", err.message);
  }

  res.status(201).send(posts[id]);
});

// Receive event from event bus
app.post("/events", (req, res) => {
  console.log("Received event:", req.body.type);
  res.send({});
});

// Start server
app.listen(4000, () => {
  console.log("V80")
  console.log("Server is listening on port 4000");
});
