require('dotenv').config();
var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db/db.sqlite"

// sequelize ORMS
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: './db/db.sqlite',
  operatorsAliases: '0'
});

var User = "";
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    
    User = sequelize.define('user', {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    }, 
    {});
    
    Txn = sequelize.define('txn', {
      timestamp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hash: {
        type: Sequelize.STRING
      },
    }, {});
  }
});

function createUser(req) {
  sequelize.sync().then(() => {
    User.create({
      name: req["username"],
      email:req["email"],
      password: md5(req["password"])
    }).then(() => {
      console.log('successfully created!!') 
    });
  });
}

async function getUser(req) {
  var result = JSON.stringify({"status":"fail", "key":""});  
  var user = await User.findAll();
  user.forEach(
    element => {
      if (req["username"] == element.name && md5(req["password"]) == element.password) { 
        result = JSON.stringify({"status":"OK", "key":process.env["API_KEY"]});  
        return result;
      }
  });
  return result;
}

async function listUser(req) {
  var result =  await User.findAll();
  return result;
}

async function writeTxn(obj_response) {
  await Txn.create({
    timestamp: 'test',
    hash: obj_response["messageID"]
  }).then(() => {
    console.log('Txn successfully created!!')
  });
}

module.exports = {db, createUser, getUser, listUser, writeTxn}
