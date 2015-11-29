var hue = require("node-hue-api");
var HueApi = require("node-hue-api").HueApi;
var fs = require('fs')

var hostname = "192.168.1.174",
    username = "1f2611e53bb150e71bf995b13046d813",
    api;

api = new HueApi(hostname, username);

var displayUserResult = function(result) {
  console.log('i am the username I guess', result)
    console.log("Created user: " + JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};


var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};
var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

fs.readFile('./username.tmp', 'utf8', function (err, data) {
  if (err) throw err;
  console.log('data',data);
});

fs.writeFile('./username.tmp', 'blah123');


var state = hue.lightState.create().off()
/*
console.log('state', state)

api.setLightState(15, state)
    .then(displayResult)
    .done();
*/
// Using a promise
api.lights()
    .then(displayResult)
    .done();
/*

// Using a promise
api.registerUser(hostname, null, 'dshjdksaskhjd')
    .then(displayUserResult)
    .fail(displayError)
    .done();


// --------------------------
// Using a promise
*/
hue.nupnpSearch().then(displayBridges).done();
api.config().then(displayResult).done();


api.config(function(err, config) {

})
