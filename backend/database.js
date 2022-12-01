require('dotenv').config();

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

var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db/db.sqlite"
var User = "";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
    
// 定義一個叫做 User 的資料結構
User = sequelize.define('user', {
  // 定義 Model 屬性
  name: {     　　　 // 欄位名稱
    type: Sequelize.STRING,  //  資料型態
    allowNull: false　　　// 能不能為空，預設是 true
  },
  email: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  password: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }

}, {
  // Other model options go here
});

const Txn = sequelize.define('txn', {
  // 定義 Model 屬性
  timestamp: {     　　　 // 欄位名稱
    type: Sequelize.STRING,  //  資料型態
    allowNull: false　　　// 能不能為空，預設是 true
  },
  hash: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
}, {
  // Other model options go here
});

    }
});

function createUser(req) {
  sequelize.sync().then(() => {
    // 寫入對映欄位名稱的資料內容
    User.create({
      // 記得 value 字串要加上引號
      name: req["username"],
      email:'yillkid@gmail.com',
      password: md5('123')
    }).then(() => {
      // 執行成功後會印出文字
      console.log('successfully created!!') 
    });
  });
}

function getUser(req) {

    var result = JSON.stringify({"status":"fail", "key":""});

    sequelize.sync().then(() => {
      User.findAll().then(user => {
        // 用 JSON.stringify() 來格式化輸出
        // console.log("All user:", JSON.stringify(user, null, 4));

        user.forEach(
          element => {
            // console.log(element.name)
            if (req["name"] == element.name && md5(req["password"]) == element.password) {
              console.log("OKOK");
	      
              result = JSON.stringify({"status":"OK", "key":process.env["API_KEY"]});
              
	      console.log("1");
	      console.log(result);
	      return result;
		// res.send(JSON.stringify({"status":"OK", "key":process.env["API_KEY"]}));
            }
          }
        );
	//return result;
          // result = JSON.stringify({"status":"fail", "key":""});
          // res.send(JSON.stringify({"status":"fail", "key":""}));
      });
    console.log("2");
    //return result;
    });
 console.log("3");
}


module.exports = {db, createUser, getUser}
