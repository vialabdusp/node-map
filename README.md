# Node.js, PostGIS, and Sequelize Web Map

## Set Up Application

```sh
$ npm install express
# Install express-generator globally.
$ npm install express-generator -g
```

```sh
$ express map_app_node --view=pug
```

## Install dependencies.

```sh
$ npm install
```

## Run application.

```sh
# Linux/macOS
$ DEBUG=map_app_node:* npm start
# Windows
$ SET DEBUG=map_app_node:* & npm start
```
```

Go to [http://localhost:3000/](http://localhost:3000/).

## Server restart when files change...

```sh
$ npm install --save-dev nodemon
```

Install as a developer dependency so developers get it.

Add it to `package.json` in the `scripts{}` section like so:

```json
"scripts": {
    "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www"
  },
```

This creates a new `command`, like `start` used above, but that runs with `nodemon` instead of `node`. We can run it like so:


```sh
# Linux/macOS
$ DEBUG=map_app_node:* npm run devstart
# Windows
$ SET DEBUG=map_app_node:* & npm run devstart
```

## Set up database connection...

```sh
# Install our ORM (object-relational mapper)
$ npm install sequelize
```

```sh
# For PostgreSQL/PostGIS installation...
$ npm install pg pg-hstore
```

### Create database...

```sh
$ psql -h localhost -U postgres
```

```sql
postgres=# CREATE DATABASE map_app_node;
postgres=# \connect map_app_node;
map_app_node=# CREATE EXTENSION postgis;

map_app_node=# CREATE USER map_app_user WITH PASSWORD 'map_app_pass';
map_app_node=# ALTER ROLE map_app_user SET client_encoding TO 'utf8';
map_app_node=# ALTER ROLE map_app_user SET default_transaction_isolation TO 'read committed';
map_app_node=# ALTER ROLE map_app_user SET timezone TO 'EST';
map_app_node=# GRANT ALL PRIVILEGES ON DATABASE map_app_node TO map_app_user;
```

### Connect application to database...

Add to `app.js`, below `var app = express();`:

```js
const Sequelize = require('sequelize');

const sequelize = new Sequelize('map_app_node', 'map_app_user', 'map_app_pass', {
  host: 'localhost',
  dialect: 'postgres'
});
```

## Build Model

Add to `models/neigh.js`:

```js
const Sequelize = require('sequelize');

module.exports = (sequelize) => { 
    return sequelize.define('neigh', {
        oid: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        length: {
            type: Sequelize.FLOAT
        },
        area: {
            type: Sequelize.FLOAT
        },
        geom: {
            type: Sequelize.GEOMETRY('POLYGON', 4326)
        }
    }, {
        // options
    })
}
```

### Import and Sync Model

```js
const NeighModel = require('./models/neigh.js');
const Neigh = NeighModel(sequelize)

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    sequelize.sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
```