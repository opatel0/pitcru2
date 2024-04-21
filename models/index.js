require('dotenv').config()
const postgres = require('postgres')

const sql = postgres(process.env.NEONDB, {
    ssl: require
})

module.exports = {
    sql: sql,
    car: require('./car'),
    seed: require('./seed')
}