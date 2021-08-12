var textract = require('textract');

// let filePath = "./doc/rei.docx";
let filePath = "./doc/rei.pdf";

textract.fromFileWithPath(filePath, function( error, text ) {
    console.log(error);
    console.log(text);
    console.log(text.indexOf('RECOMMENDATION:'));
    console.log(text.substring(text.indexOf('RECOMMENDATION:'),text.indexOf('Name and Title of Assessing Official:')).replace('FOR OFFICIAL USE ONLY / SOURCE SELECTION INFORMATION - SEE FAR 2.101, 3.104, AND 42.1503',''));

})
