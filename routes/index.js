const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Happy Fruit Store",
    subTitle: "an e-commerce"
  });
});

module.exports = router;
