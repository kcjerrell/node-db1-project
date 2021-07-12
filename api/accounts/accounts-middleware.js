const { json } = require('express');
const accounts = require('./accounts-model')

/** @type {import("express").RequestHandler} */
exports.checkAccountPayload = (req, res, next) => {
  if (req.body) {
    let { name, budget } = req.body;
    let validationError = "";

    if (name === undefined || budget === undefined) {
      validationError = "name and budget are required";
    }
    else {
      if (typeof (name) !== "string") {
        validationError = "name of account must be a string";
      }
      else if (name.trim().length < 3 || name.trim().length > 100) {
        validationError = "name of account must be between 3 and 100";
      }

      if (isNaN(budget) || budget === null) {
        validationError = "budget of account must be a number";
      }
      else if (budget < 0 || budget > 1000000) {
        validationError = "budget of account is too large or too small";
      }
    }

    if (validationError) {
      res.status(400).json({ message: validationError });
    }
    else {
      req.account = { name: name.trim(), budget: parseFloat(budget) };
      next();
    }
  }
}

/** @type {import("express").RequestHandler} */
exports.checkAccountNameUnique = (req, res, next) => {
  const name = req.account.name;
  accounts.isNameAvailable(name).then(result => {
    if (result)
      next();
    else
      res.status(400).json({ message: "that name is taken" });
  }, error => next(error));
}

/** @type {import("express").RequestHandler} */
exports.checkAccountId = (req, res, next) => {
  const id = req.params.id;
  accounts.getById(id).then(result => {
    if (result) {
      req.account = result;
      next();
    }
    else {
      res.status(404).json({ message: "account not found" });
    }
  }, error => next(error));
}
