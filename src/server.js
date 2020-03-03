const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//  Handle POST
const handlePost = (request, response, parsedUrl) => {
  //  Add card if properly pathed
  if (parsedUrl.pathname === '/addCard') {
    const res = response;

    //  Byte that stream
    const body = [];

    // Yeet that 400 if the upload errors
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    //  Collect the bytes
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    //  End of upload stream
    request.on('end', () => {
      //  Convert the bytes into one CHOMP
      const bodyString = Buffer.concat(body).toString();
      //  Parse chomp
      const bodyParams = query.parse(bodyString);

      //  Pass to addCard
      jsonHandler.addCard(request, res, bodyParams);
    });
  }
};

//  Give the GET's
const handleGet = (request, response, parsedUrl) => {
  //  Give the right thing based on url
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getCards') {
    jsonHandler.getCards(request, response);
  } else {
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  //  Parse URL components
  const parsedUrl = url.parse(request.url);

  //  Check if POST, otherwise assume GET
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
