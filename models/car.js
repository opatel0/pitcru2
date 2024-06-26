module.exports = {
    getCar: async function (db, id) {
        const car = await db 
            `SELECT * FROM cars 
                JOIN car_data 
                ON cars.id = car 
                WHERE cars.id = ${id};`
        return car
    },

    getCars: async function (db, take=12, page=0) {
        const cars = await db `SELECT * FROM cars LIMIT ${take} OFFSET ${page};`
        return cars
    },

    getCarCount: async function (db) {
        const count = await db `SELECT COUNT(id) FROM cars;`
        return count
    }
}