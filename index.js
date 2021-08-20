require('dotenv').config()
const AWS = require('aws-sdk');
const https = require('https');
const fs = require('fs');
var async = require('async');
var request = require('request');
var textract = require('textract');
let filePath = "./doc/rei.pdf";

console.log(process.env);
AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region,
  });

var quicksight = new AWS.Service({
    apiConfig: require('./quicksight-2018-04-01.min.json'),
    region: process.env.region,
});

var comprehend = new AWS.Comprehend({
    apiVersion: '2017-11-27',
    region: process.env.region,
});


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
    // key: fs.readFileSync('/etc/letsencrypt/live/qa1.reisystems.in/privkey.pem'),
    // cert: fs.readFileSync('/etc/letsencrypt/live/qa1.reisystems.in/fullchain.pem'),
};
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

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
        'AwsAccountId': process.env.AwsAccountId,
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

app.post('/sentiment1', function(req, res){
    console.log('sentiment');

    async.waterfall([
        function (done) {
            comprehend.batchDetectKeyPhrases(req.body,function(err,data) {
                if(err) {
                    done(null, err);
                } else {
                    done(null, data.ResultList[0]);
                }
            });
        },
        function (keys, done) {
            comprehend.batchDetectSentiment(req.body,function(err,data) {
                if(err) {
                    done(null, err);
                } else {
                    let obj = {
                        keys: keys,
                        analysis: data.ResultList[0]
                    }
                    done(null, obj);
                }
            });
    }], function (err,data) {
        if (err) {
            res.statusCode = 401;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(data);
        }
    });

});

app.get('/sentiment/:id', function(req, res){
    console.log('sentiment:id');

    async.waterfall([
        function (done) {
            let params = {
                "LanguageCode": "en",
                "TextList": []   
            }
            textract.fromFileWithPath(filePath, function( error, text ) {
                // console.log(error);
                // console.log(text);
                let PASTPERFORMANCE = text.substring(text.indexOf('Assessing Official Comments:'),text.indexOf('RECOMMENDATION:')).replace('FOR OFFICIAL USE ONLY / SOURCE SELECTION INFORMATION - SEE FAR 2.101, 3.104, AND 42.1503','');
                let RECOMMENDATION = text.substring(text.indexOf('RECOMMENDATION:'),text.indexOf('Name and Title of Assessing Official:')).replace('FOR OFFICIAL USE ONLY / SOURCE SELECTION INFORMATION - SEE FAR 2.101, 3.104, AND 42.1503','');
                // params.TextList.push(PASTPERFORMANCE.substring(0,5000));
                params.TextList.push(RECOMMENDATION);
                // params.TextList.push(text);
                // console.log(" ============== ",params);
                done(null, params);
            })
        },
        function (params,done) {
            comprehend.batchDetectKeyPhrases(params,function(err,data) {
                if(err) {
                    done(null, {err: err, params: params});
                } else {
                    done(null, {keys: data.ResultList, params: params});
                }
            });
        },
        function (params, done) {
            console.log(params);
            comprehend.batchDetectSentiment(params.params,function(err,data) {
                if(err) {
                    done(null, err);
                } else {
                    let obj = {
                        keys: params.keys,
                        analysis: data.ResultList
                    }
                    console.log(" ========== obj: ", obj)
                    done(null, obj);
                }
            });
    }], function (err,data) {
        if (err) {
            res.statusCode = 401;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(data);
        }
    });

});

app.get('/search', function(req, res){
    console.log(req.query);
    console.log(typeof req.query);

    request({
        method: 'GET',
        uri: 'https://search-sam-yxvphgkmpxmd7aizuihmx4pmgi.us-east-2.es.amazonaws.com/_search?q=' + req.query.q,
        headers: {
            'Authorization': 'Basic ' + new Buffer(process.env.username + ':' + process.env.password).toString('base64')
        }
    },function(error, response, body){
        body = JSON.parse(body);
        res.statusCode = 200;
        res.send(body);
    });

});

app.listen(9001, function(){
    console.log('listening');
});
// https.createServer(options, app).listen(9001, () => console.log(`Server started at port : 9001`));


