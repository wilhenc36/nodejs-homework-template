const express = require("express");
const service = require("../../models/contacts");
const { addContact, updateContact } = require("../../schemas");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { success, result, message } = await service.listContacts();

  if (!success) {
    return res.status(400).json({
      result,
      message,
    });
  }

  return res.status(200).json({
    result,
    message,
  });
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const { success, result, message } = await service.getContactById(id);

  if (!success) {
    return res.status(404).json({
      result,
      message,
    });
  }

  return res.status(200).json({
    result,
    message,
  });
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name)
    return res.status(400).json({
      result: null,
      message: "missing required name field",
    });
  if (!email)
    return res.status(400).json({
      result: null,
      message: "missing required email field",
    });
  if (!phone)
    return res.status(400).json({
      result: null,
      message: "missing required phone field",
    });

  const { success, result, message } = await service.addContact({
    name,
    email,
    phone,
  });

  if (!success) {
    return res.status(400).json({
      result,
      message,
    });
  }

  return res.status(201).json({
    result,
    message,
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const { success, result, message } = await service.removeContact(id);

  if (!success) {
    return res.status(404).json({
      result,
      message,
    });
  }

  return res.status(200).json({
    result,
    message,
  });
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = updateContact.validate(req.body);
  const valid = error == null;

  if (!valid) {
    const { details } = error;
    const message = details.map((i) => i.message).join(",");
    res.status(400).json({
      result: null,
      message,
    });
  }

  const {result, success, message} = await service.updateContact(req.params.contactId, req.body)

  if (!success) {
    return res.status(404).json({
      result,
      message,
    });
  }

  return res.status(200).json({
    result,
    message,
  });
});

module.exports = router;
