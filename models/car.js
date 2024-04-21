module.exports = {
    getCar: async function (db, id) {
        await db `SELECT * FROM cars WHERE id = ${id}`
            .then(query => console.log(query))
    },

    getCars: async function (db, offset=0) {
        const start = 12 * offset
        let cars = []
        for (let i=start; i<start+12; i++) {
            await db `SELECT get_cars(${i});`
                .then(car => cars.push(car))
        }
        return cars
    },

    getCarCount: async function (db) {
        const count = await db `SELECT COUNT(id) FROM cars;`
        return count
    }
}