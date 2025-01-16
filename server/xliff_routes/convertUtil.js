const fs = require('fs');
const pdfParse = require('pdf-parse');

const pdfPath = '/test.pdf';


fs.readFile(pdfPath, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  
  pdfParse(data).then(function (result) {
    console.log(result.text);  
  });
});
