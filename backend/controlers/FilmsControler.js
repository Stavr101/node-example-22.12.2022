class FilmsController {
  add(req, res) {
    res.status(200).send("add");
  }
  getAll(req, res) {
    res.status(200).send("getAll");
  }
  getOne(req, res) {
    res.status(200).send("getOne");
  }
  updateOne(req, res) {
    res.status(200).send("updateOne");
  }
  remove(req, res) {
    res.status(200).send("remove");
  }
}

module.exports = new FilmsController();
