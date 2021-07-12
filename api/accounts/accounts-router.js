const router = require('express').Router();
const accounts = require('./accounts-model');
const {checkAccountId, checkAccountNameUnique, checkAccountPayload} = require('./accounts-middleware');
const { json } = require('express');

router.get('/', (req, res, next) => {
  accounts.getAll()
    .then(result => res.status(200).json(result))
    .catch(error => next(error));
})

router.get('/:id', checkAccountId, (req, res) => {
  const { name, budget } = req.account;
  res.status(200).json({ name, budget });
})

router.post('/', checkAccountPayload, checkAccountNameUnique, (req, res, next) => {
  accounts.create(req.account).then(() => {
    res.status(201).json(req.account);
  }, error => next(error));
})

router.put('/:id', checkAccountId, checkAccountPayload, (req, res, next) => {
  accounts.updateById(req.params.id, req.account).then(result => {
    if (result)
      res.status(200).json(req.account);
    else
      res.status(400).json({ message: "some error" });
  })
});

router.delete('/:id', checkAccountId, (req, res, next) => {
  accounts.deleteById(req.params.id).then(result => {
    if (result)
      res.status(200).json(req.account);
    else
      res.status(400).json({message: "could not be deleted"});
  })
})

router.use((err, req, res, next) => { // eslint-disable-line
  console.log(err);
  res.status(500).send("some error");
})

module.exports = router;
