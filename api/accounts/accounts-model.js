const db = require('../../data/db-config');

const getAll = async () => {
  const records = await db.select().from('accounts');
  return records;
}

const getById = async (id) => {
  const record = await db('accounts')
    .where({
      id: id
    })
    .select();

  return record[0];
}

const isNameAvailable = async (name) => {
  const count = await db('accounts').count().where({
    name: name
  });

  return count[0]['count(*)'] === 0;
}

const create = async account => {
  const result = await db('accounts').insert({
    name: account.name,
    budget: account.budget,
  });
  return result;
}

const updateById = async (id, account) => {
  const result = await db('accounts').where({ id })
    .update({
      name: account.name,
      budget: account.budget
    });

  return result;
}

const deleteById = async id => {
  const result = await db('accounts').where({ id }).delete();

  return result;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  isNameAvailable,
}
