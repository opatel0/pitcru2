require('dotenv').config()
const axios = require('axios')

module.exports = {
    createTable: async function (db) {
        await db `
            CREATE TABLE cars (
                id serial PRIMARY KEY,
                city_mpg integer,
                class text,
                combination_mpg integer,
                cylinders integer,
                drive text,
                fuel_type text,
                highway_mpg integer,
                make text NOT NULL,
                model text NOT NULL,
                transmission text,
                year integer NOT NULL,
                is_featured boolean,
                UNIQUE (year, make, model)
            );
        `.then(query => console.log(query))
    },

    deleteTable: async function (db) {
        await db `
            DROP TABLE IF EXISTS cars;
        `.then(query => console.log(query))
    },

    seedPaginatorType: async function (db) {
        await db `
            CREATE TYPE result AS (page_year integer, page_make text, page_model text);
        `.then(query => console.log(query))
    },

    deletePaginatorType: async function (db) {
        await db `
            DROP TYPE IF EXISTS result;
        `.then(query => console.log(query))
    },

    seedPaginator: async function (db) {
        await db `
            CREATE FUNCTION get_cars(page_offset integer) RETURNS result
            LANGUAGE SQL
            AS $$
            SELECT year, make, model FROM cars LIMIT 1 OFFSET page_offset;
            $$;
        `.then(async query => console.log(query))
    },

    deletePaginator: async function (db) {
        await db `
            DROP FUNCTION IF EXISTS get_cars;
        `.then(async query => console.log(query))
    },

    seedCars: async function (db) {
        const authHeader = { headers: { 'X-API-KEY': process.env.APININJASKEY} }
        let counter = 1
        const cars = [
            "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Volkswagen", "Dodge", "Pontiac", "Oldsmobile", "Buick", "Plymouth", "Chrysler", "Mercedes-Benz", "BMW", "Mazda", "GMC", "Jeep", "Subaru", "Volvo", "Mitsubishi", "Mercury", "Cadillac", "Isuzu", "Lincoln", "Saab", "Jaguar", "Lexus", "Acura", "Alfa Romeo", "Audi", "Fiat", "Land Rover", "Porsche", "Suzuki", "Hyundai", "Kia", "Daihatsu", "Peugeot", "Renault", "Opel", "Lancia", "Citroën", "Triumph", "Datsun", "Infiniti", "Pontiac", "AMC", "Geo", "Plymouth", "Eagle"
        ]
        const years = [
            "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"
        ]
        // save the first of each unique combo of year/make/model returned from querying API-Ninjas vehicle database
        cars.forEach(car => years.forEach(year => {setTimeout(() => {
            axios.get(`https://api.api-ninjas.com/v1/cars?limit=50&make=${car}&year=${year}`, authHeader)
                .then(async cars => {cars.data.forEach(async car => {
                    try {
                        await db `
                        INSERT INTO cars (
                            city_mpg,
                            class,
                            combination_mpg,
                            cylinders,
                            drive,
                            fuel_type,
                            highway_mpg,
                            make,
                            model,
                            transmission,
                            year
                        ) VALUES (
                            ${car.city_mpg},
                            ${car.class},
                            ${car.combination_mpg},
                            ${car.cylinders},
                            ${car.drive},
                            ${car.fuel_type},
                            ${car.highway_mpg},
                            ${car.make},
                            ${car.model},
                            ${car.transmission},
                            ${car.year}
                        );
                    `.then(query => console.log(query))
                    }
                    catch (error) {
                        console.log(error)
                    }
                    })
                })
            }, (counter * 5000))
            counter += 1
        }))
    }
}