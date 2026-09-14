const express = require("express");
const router = express.Router();
const store = require("../db/store");

router.get("/", (req, res) => {
  const users = store.getAll ? store.getAll() : store.find ? store.find() : [];
  res.json(users);
});

router.post("/", (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const createFn = store.create || store.add || store.insert;
  const user = createFn({ name, email });
  res.status(201).json(user);
});

router.get("/:id", (req, res) => {
  const findByIdFn = store.getById || store.findById || store.find;
  const user = findByIdFn(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "Validation failed: missing fields" });
  }

  const findByIdFn = store.getById || store.findById || store.find;
  const existingUser = findByIdFn(id);
  if (!existingUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const updateFn = store.update || store.save;
  const updatedUser = updateFn(id, { name, email });
  res.json(updatedUser);
});

module.exports = router;