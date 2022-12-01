// Create express app
require('dotenv').config();
var express = require("express")
var bodyParser = require("body-parser");
var cors = require('cors');
var app = express()
var md5 = require('md5')
var request = require('request');
var db = require("./database.js")

// Cors
app.use(cors());
app.use(bodyParser.json());

// Server port
var HTTP_PORT = process.env["APP_PORT"] 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints
app.get("/api/users", (req, res, next) => {
  sequelize.sync().then(() => {
      User.findAll().then(user => {
        // 用 JSON.stringify() 來格式化輸出
        console.log("All user:", JSON.stringify(user, null, 4));
        res.send( JSON.stringify(user, null, 4));
      });
    });
});

app.post("/accounts/signup", (req, res) => {
  db.createUser(req.body);

  res.send(req.body);
});

app.post("/accounts/signin", (req, res) => {
    
    var result = db.getUser(req.body);
    console.log(result);
    res.send(result);
/*
    sequelize.sync().then(() => {
      User.findAll().then(user => {
        // 用 JSON.stringify() 來格式化輸出
        // console.log("All user:", JSON.stringify(user, null, 4));

        user.forEach(
	  element => {
	    // console.log(element.name)
	    if (req.body["name"] == element.name && md5(req.body["password"]) == element.password) {
	      
              console.log(JSON.stringify({"status":"OK", "key":process.env["API_KEY"]}));
	      res.send(JSON.stringify({"status":"OK", "key":process.env["API_KEY"]}));
	    }
	  }
	);
	  console.log(JSON.stringify({"status":"fail", "key":""}));
	  res.send(JSON.stringify({"status":"fail", "key":""}));
      });
    });
*/
});

app.post("/txn/send", (req, res) => {
  console.log('Got body:', req.body);
 
  var options = {
    'method': 'POST',
    'url': 'http://poe.townway.com.tw/iota/message',
    'headers': {
      'Authorization': process.env["API_KEY"],
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(req.body) //'{\n    "message":"123"\n}'

  };

  var obj_response = null;
  request(options, function (error, response) {
    if (error) throw new Error(error);
      console.log("OK");
      console.log(response.body);
  
      obj_response = JSON.parse(response.body)

      sequelize.sync().then(() => {
        // 寫入對映欄位名稱的資料內容
        Txn.create({
          // 記得 value 字串要加上引號
          timestamp: 'test',
          hash: obj_response["messageID"]
        }).then(() => {
          // 執行成功後會印出文字
          console.log('successfully created!!')

	  console.log("response")
          console.log(response.body);
          res.send(response.body);
        });
      });
    });
});

app.post("/txn/list", (req, res, next) => {
    sequelize.sync().then(() => {
      Txn.findAll().then(txn => {
        // 用 JSON.stringify() 來格式化輸出
        console.log("All txn:", JSON.stringify(txn, null, 4));
        res.send( JSON.stringify(txn, null, 4));
      });
    });
});

app.post("/credentials/verify", (req, res) => {
  var options = {
    'method': 'POST',
    'url': 'http://poe.townway.com.tw/credentials/verify',
    'headers': {
      'Authorization': process.env["API_KEY"],
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(req.body) 
  };

  var obj_response = null;
  request(options, function (error, response) {
    if (error) throw new Error(error);
      console.log("OK");
      console.log(response.body);

      obj_response = JSON.parse(response.body)
      res.send(response.body);
    });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
