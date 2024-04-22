# PiTCRU 
🏎️ Deployment repo for demo PiTCRU web application, deployed [here](https://pitcru-b957da173327.herokuapp.com/)
🏎️ Simply clone, add API key and NeonDB connection string to environment variables, and run index.js to seed db
🏎️ Refer to models folder for seed script and SQL query examples


## Known Limitations
🏎️ PiTCRU was originally designed as a Django/Python web application, deployed [here](https://pitcrudjango-64042ab7cb0b.herokuapp.com/) and managed [here](https://github.com/opatel0/pitcru) <br>
🏎️ The purpose of this minimally styled refactored application is to showcase handwritten SQL statements. <br>
🏎️ The backend design is vulnerable to SQL Injection and does not follow quality standards of web apps. <br>
🏎️ The application is minimally styled compared to its parent <br>


## Technologies Used
🏎️ PiTCRU is a node.js/express app with PostgreSQL backend.<br>
🏎️ This app implements node's [postgres library](https://www.npmjs.com/package/postgres) <br>
🏎️ Vehicle data is seeded from API Ninjas' Cars API.<br>
🏎️ The seed script can be found in 'models/seed.js' and can be run as `node models/index.js` from root of project after NEONDB connection string and API-Ninjas API Key have been provided in .env
<details>
<summary>Seed Script Pseudocode</summary>
<pre>
cars = list of car makes known to be available from API Ninjas
years = list of years known to be available from API Ninjas
for car,year of cars,years:
    search_api(car, year)
    THEN looping over returned car data as car:
    sql_constructor: 
        `INSERT INTO cars (
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
        );`
</pre>
</details>
🏎️ The paginator is managed through a stored function as defined below. <br>
<details>
<summary>Paginator</summary>
<pre>
// SEED SCRIPTS
seedPaginatorType: async function (db) {
    await db `
        CREATE TYPE result AS (page_year integer, page_make text, page_model text);
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
}
<br>
// FUNCTION CALL
getCars: async function (db, offset=0) {
    const start = 12 * offset
    let cars = []
    for start to start+12 {
        await db `SELECT get_cars(${i});`
            .then(car => cars.push(car))
    }
    return cars
}
<br>
// ROUTE
router.get('/', (req, res) => {
    let offset = req.query.page ? req.query.page : 1
    db.car.getCars(db.sql, offset-1)
        .then(cars => db.car.getCarCount(db.sql)
        .then(count => res.render('car-index', {cars: cars, count: count, offset: offset})
        ))
})
</pre>
</details>