//const request = require('request');
//const fs = require('fs')
const { exec } = require("child_process");
const params = process.argv.splice(2, 4);
const network = params[0];
const source = params[1];
const dest = params[2];
const amount = params[3];
const link = `https://apiv5.paraswap.io/prices?network=${network}&srcToken=${source}&destToken=${dest}&amount=${amount}&side=BUY`

console.info(`params: ${params}`);
console.info(`Link: ${link}`);

exec(`curl ${link}`, (error, stdout, stderr) => {
	    if (error) {
		            console.log(`error: ${error.message}`);
//		            return;
		        }
	    if (stderr) {
		            console.error(`stderr: ${stderr}`);
//		            return;
		        }
	    console.log(`stdout: ${stdout}`);
});


//const getPrice = () => request({
//		url: "https://apiv5.paraswap.io/prices?network=1&srcToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&srcDecimals=0&destToken=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&destDecimals=0&amount=10000&side=BUY",
//	    //method: 'POST',
//	    headers: {
//		            'Content-Type': 'application/json'
//		        }
//}, function(error, response, body){
//	    if(error) {
//		            console.log(error);
//		        } else {
//				        console.log(response.statusCode, body);
//				    }
//});

//for (var i = 0; i < 3; i++) {
//	setTimeout(getPrice, 0);
//}

//fs.readFile('test.json', 'utf8', function (err,data) {
//	  if (err) {
//		      return console.log(err);
//		    }
//	  jsonData = JSON.parse(data);
//});
