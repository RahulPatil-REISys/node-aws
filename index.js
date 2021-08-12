const AWS = require('aws-sdk');
const https = require('https');
const fs = require('fs');


AWS.config.update({
    accessKeyId: 'AKIA6RC55GFFRMETMH7G',
    secretAccessKey: '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',
    region: 'us-east-1',
  });

var quicksight = new AWS.Service({
    apiConfig: require('./quicksight-2018-04-01.min.json'),
    region: 'us-east-1',
});

// console.log(quicksight.config.apiConfig.operations);

// quicksight.listUsers({
//     // Enter your actual AWS account ID
//     'AwsAccountId': '998776844619', 
//     'Namespace': 'default',
// }, function(err, data) {
//     console.log('---');
//     console.log('Errors: ');
//     console.log(err);
//     console.log('---');
//     console.log('Response: ');
//     console.log(data);
// });
// quicksight.listNamespaces({
//     'AwsAccountId': '998776844619'
// }, function(err, data) {
//     console.log('---');
//     console.log('Errors: ');
//     console.log(err);
//     console.log('---');
//     console.log('Response: ');
//     console.log(data);
// });


var express = require('express');
var cors = require('cors')
var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/qa1.reisystems.in/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/qa1.reisystems.in/fullchain.pem'),
};
var app = express();
app.use(cors());
app.get('/url/:id', function(req, res){
    console.log(req.params.id)
    var dashboardId = '';
    if(req.params.id == "OPPORTUNITY"){
        dashboardId = 'f9345da9-a86a-4ca7-84bc-b687b5d8df67';
    }
    if(req.params.id == "RECOMMENDATIONS"){
        dashboardId = 'c293b138-c42a-4e23-922c-a24a988e9081';
    }
    if(req.params.id == "RATING"){
        dashboardId = 'f0e81466-7d03-427b-8122-dcae0fcc624a';
    }
    if(req.params.id == "VENDOR"){
        dashboardId = '1b8f3b81-8145-4a47-9293-fcf3393e0bda';
    }
    if(req.params.id == "TOPVENDOR"){
        dashboardId = '6f3650bf-600d-45a8-b4a6-726305e3cd72';
    }
    if(req.params.id == "OPPVEHICLE"){
        dashboardId = '800ec831-da52-46f5-8888-f5668ea49b7d';
    }
    
   if(req.params.id == "CONTRACT"){
       dashboardId = '5e248c29-45e3-4968-a330-8f68a109facc';
   }
   
   if(req.params.id == "TREE"){
       dashboardId = '87d6abd9-1ffc-473a-99ff-0d8d302d29f3';
   }
 
   quicksight.getDashboardEmbedUrl({
        // Enter your actual AWS account ID
        'AwsAccountId': '998776844619', 
        'DashboardId': dashboardId, 
        'IdentityType': 'ANONYMOUS',
        'Namespace': 'default'
    }, function(err, data) {
        console.log('---');
        console.log('Errors: ');
        console.log(err);
        console.log('---');
        console.log('Response: ');
        console.log(data);
        res.send({url: data.EmbedUrl});
    });
});
//app.listen(9001, function(){
//console.log('listening');
//});
https.createServer(options, app).listen(9001, () => console.log(`Server started at port : 9001`));


