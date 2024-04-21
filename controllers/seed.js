const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', async (req, res) => {
    await db.seed.deleteTable(db.sql)
        .then(async () => await db.seed.createTable(db.sql)
        .then(async () => await db.seed.seedCars(db.sql)
        ))
})

router.get('/procedures', async (req, res) => {
    await db.seed.deletePaginator(db.sql)
        .then(async () => db.seed.deletePaginatorType(db.sql)
        .then(async () => db.seed.seedPaginatorType(db.sql)
        .then(async () => db.seed.seedPaginator(db.sql)
        )))
})

module.exports = router