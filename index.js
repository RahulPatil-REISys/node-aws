const AWS = require('aws-sdk');
const https = require('https');

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
var app = express();

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
app.listen(3000);


