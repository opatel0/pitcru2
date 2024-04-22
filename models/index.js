require('dotenv').config()
const axios = require('axios')
const postgres = require('postgres')

const sql = postgres(process.env.NEONDB, {
    ssl: require
})

const seedCarsTable = async function (db) {
    const table = await db `
        CREATE TABLE cars (
            id serial PRIMARY KEY,
            make text NOT NULL,
            model text NOT NULL,
            year integer NOT NULL,
            UNIQUE (year, make, model)
        );
    `
    return table
}

const deleteCarsTable = async function (db) {
    const table = await db `
        DROP TABLE IF EXISTS cars;
    `
    return table
}

const seedCarDataTable = async function (db) {
    const table = await db
        `CREATE TABLE car_data (
            id serial PRIMARY KEY,
            city_mpg integer,
            class text,
            combination_mpg integer,
            cylinders integer,
            drive text,
            fuel_type text,
            highway_mpg integer,
            transmission text,
            car integer REFERENCES cars ON DELETE CASCADE
        );`
    return table
}

const deleteCarDataTable = async function (db) {
    const table = await db `
        DROP TABLE IF EXISTS car_data;
    `
    return table
}

const seedPaginatorType = async function (db) {
    const type = await db `
        CREATE TYPE result AS (page_year integer, page_make text, page_model text);
    `
    return type
}

const deletePaginatorType = async function (db) {
    const type = await db `
        DROP TYPE IF EXISTS result;
    `
    return type
}

const seedPaginator = async function (db) {
    const paginator = await db `
        CREATE FUNCTION get_cars(take integer, page integer) RETURNS result
        LANGUAGE SQL
        AS $$
        SELECT year, make, model FROM cars LIMIT take OFFSET page;
        $$;
    `
    return paginator
}

const deletePaginator = async function (db) {
    const paginator = await db `
        DROP FUNCTION IF EXISTS get_cars;
    `
    return paginator
}

const seedDetailsByIdIndex = async function (db) {
    const index = await db `
        CREATE INDEX get_car_details_by_id ON cars (id);
    `
    return index
}

const deleteDetailsByIdIndex = async function (db) {
    const index = await db `
        DROP INDEX IF EXISTS get_car_details_by_id;
    `
    return index
}

const seedDetailsByCarIndex = async function (db) {
    const index = await db `
        CREATE INDEX get_car_details_by_car ON cars (year, make, model);
    `
    return index
}

const deleteDetailsByCarIndex = async function (db) {
    const index = await db `
        DROP INDEX IF EXISTS get_car_details_by_car;
    `
    return index
}

const seedCars = async function (db) {
    const authHeader = { headers: { 'X-API-KEY': process.env.APININJASKEY} }
    let counter = 1
    
    // these lists were generated by a few rounds of querying/testing the API, as very limited documentation exists 
    const cars = [
        "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Volkswagen", "Dodge", "Pontiac", "Oldsmobile", "Buick", "Plymouth", "Chrysler", "Mercedes-Benz", "BMW", "Mazda", "GMC", "Jeep", "Subaru", "Volvo", "Mitsubishi", "Mercury", "Cadillac", "Isuzu", "Lincoln", "Saab", "Jaguar", "Lexus", "Acura", "Alfa Romeo", "Audi", "Fiat", "Land Rover", "Porsche", "Suzuki", "Hyundai", "Kia", "Daihatsu", "Peugeot", "Renault", "Opel", "Lancia", "Citroën", "Triumph", "Datsun", "Infiniti", "Pontiac", "AMC", "Geo", "Plymouth", "Eagle"
    ]
    const years = [
        "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"
    ]

    // saves the first of each unique combo of year/make/model returned from querying API-Ninjas vehicle database
    cars.forEach(car => years.forEach(year => {setTimeout(async () => {
        await axios.get(`https://api.api-ninjas.com/v1/cars?limit=50&make=${car}&year=${year}`, authHeader)
            .then(async carsData => {carsData.data.forEach(async carData => {
                try {
                    await db `INSERT INTO cars (
                            make,
                            model,
                            year
                        ) VALUES (
                            ${carData.make},
                            ${carData.model},
                            ${carData.year}
                        );`
                    let carId = await db `SELECT id FROM cars 
                        WHERE year = ${carData.year} AND make LIKE ${carData.make} AND model LIKE ${carData.model};`
                    await db `INSERT INTO car_data (
                            city_mpg,
                            class,
                            combination_mpg,
                            cylinders,
                            drive,
                            fuel_type,
                            highway_mpg,
                            transmission,
                            car
                        ) VALUES (
                            ${carData.city_mpg},
                            ${carData.class},
                            ${carData.combination_mpg},
                            ${carData.cylinders},
                            ${carData.drive},
                            ${carData.fuel_type},
                            ${carData.highway_mpg},
                            ${carData.transmission},
                            ${carId[0].id}
                        );`
                }
                catch (error) {
                    console.log(error)
                }
            })})
    }, (counter * 5000))
    counter += 1
    }))
}

const main = function (db) {
    deleteCarDataTable(db)
        .then(() => deleteCarsTable(db)
        .then(() => deletePaginator(db)
        .then(() => deletePaginatorType(db)
        .then(() => deleteDetailsByIdIndex(db)
        .then(() => deleteDetailsByCarIndex(db)
        .then(() => seedCarsTable(db)
        .then(() => seedCarDataTable(db)
        .then(() => seedPaginatorType(db)
        .then(() => seedPaginator(db)
        .then(() => seedCars(db)
    ))))))))))
}

module.exports = {
    sql: sql,
    car: require('./car')
}

if (typeof require !== 'undefined' && require.main === module) {
    main(sql);
}