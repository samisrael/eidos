const express = require("express");
const { predictSpecies } = require("../controllers/predictController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/predict").post(predictSpecies);



module.exports = router;

