//  Reminder: This is volatile data and nothing should
//  be permanently stored here.
const cards = {};

//  Respond with JSON object
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, {'Content-Type':'application/json'});
  //  May be broken, double-check later
  response.write(JSON.stringify(object));
  response.end();
};

//  Responds without json body
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {'Content-Type':'application/json'});
  response.end();
};

//  Return JSON cards
const getCards = (request, response) => {
  const responseJSON = {
    cards,
  };

  respondJSON(request, response, 200, responseJSON);
};

//  Add user from POST
const addCard = (request, response, body) => {
  // Default message
  const responseJSON = {
    message: 'All fields must be valid',
  };

  //  Validate data integrity, 
  //  we can check more than just its existence here
  if (!body.name || !body.health || !body.attack || !body.drawing) {
    responseJSON.id = 'missingParams';
    //  Bad boi number 400
    return respondJSON(request, response, 400, responseJSON);
  }

  //  Assume creation
  let responseCode = 201;

  //  If name already exists, just update age
  if (cards[body.name]) {
    //  Change status code to 204, updated
    responseCode = 204;
  } else {
    //  Detroit: Create card
    cards[body.name] = {};
  }

  //  Give that card his data
  cards[body.name].name = body.name;
  cards[body.name].health = body.health;
  cards[body.name].attack = body.attack;
  cards[body.name].drawing = body.drawing;

  //  Message from the creator, god's voice shall be sent
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    responseJSON.cards = cards;
    return respondJSON(request, response, responseCode, responseJSON);
  }
  //  204 or success can't have a body, so just fire it back
  return respondJSONMeta(request, response, responseCode);
};

//  E x p o r t a t i o n
module.exports = {
  getCards,
  addCard,
};
