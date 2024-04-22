const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', (req, res) => {
    let offset = req.query.page ? req.query.page : 1
    db.car.getCars(db.sql, 12, offset-1)
        .then(cars => db.car.getCarCount(db.sql)
        .then(count => res.render('car-index', {cars: cars, count: count, offset: offset})
        ))
})

router.get('/:id', (req, res) => {
    db.car.getCar(db.sql, req.params.id)
        .then(car => res.render('car-details', {car: car}))
})

module.exports = router