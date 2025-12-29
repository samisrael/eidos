require("dotenv").config();
// require("express-async-errors");

const connectDB = require("./config/dbConnect");
const express = require("express");
const cors = require("cors");
const app = express();
const mainRouter = require("./routes/userRoutes");
const predictRoutes = require("./routes/predictRoutes");

app.use(express.json());

app.use(cors());
app.use("/api/v1", mainRouter);
app.use("/api/v1", predictRoutes);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();