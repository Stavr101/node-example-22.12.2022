// http://localhost:62000/api/v1/films

const express = require("express");
const router = express.Router();
const { filmsController } = require("../controlers");

router.get("/", filmsController.getAll);

router.get("/:id", filmsController.getOne);

router.post("/", filmsController.add);

router.put("/:id", filmsController.updateOne);

router.delete("/:id", filmsController.remove);

module.exports = router;
