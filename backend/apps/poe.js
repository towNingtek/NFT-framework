require('dotenv').config();
var request = require('request');

function doRequest(req, path) {
  return new Promise(function (resolve, reject) {
    var options = {
      'method': 'POST',
      'url': process.env["URL_POE_SERVICE"] + path,
      'headers': {
        'Authorization': process.env["API_KEY"],
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(req.body)
    };
    request(options, function (error, res) {
      if (!error && res.statusCode === 200) {
        resolve(res.body);
      } else {
        reject(error);
      }
    });
  });
}

async function send(req) {
  try {
    let response = await doRequest(req, '/iota/message');
    return response;
  } catch (error) {
    return error;
  }
}

async function list(req) {
  var result =  await Txn.findAll();
  return result;
}

async function verify(req) {
  try {
    let response = await doRequest(req, '/credentials/verify');
    return response;
  } catch (error) {
    return error;
  }
}

module.exports = {send, list, verify}
