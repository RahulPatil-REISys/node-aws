let fs = require('fs'),PDFParser = require("pdf2json");
let pdfParser = new PDFParser();
let path = "./doc/rei.docx";
// let path = "./doc/rei.pdf";
// let path = "./doc/1.pdf";
pdfParser.on("pdfParser_dataError", function(errData) {
    console.error(errData.parserError)
});
pdfParser.on("pdfParser_dataReady", function(pdfData) {
    console.log(pdfParser.getRawTextContent())
    console.log(pdfParser.getAllFieldsTypes())
    // fs.writeFile("./doc/rei.txt" , JSON.stringify(pdfParser.getAllFieldsTypes()), function(err, result) {
    //     console.log(result);
    // });
});

// pdfParser.loadPDF(path);

fs.readFile(path, (err, pdfBuffer) => {
    if (!err) {
        console.log(pdfBuffer)
    //   pdfParser.parseBuffer(pdfBuffer);
    }
  })