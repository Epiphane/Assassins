var swag       = require("swagger-node-express");
var paramTypes = swag.paramTypes;
var swe        = swag.errors;

var model = {
  "Game":{
    "id":"Game",
    "required": ["_id", "name"],
    "properties":{
      "_id":{
        "type":"integer",
        "format": "int64",
        "description": "Game unique identifier"
      },
      "name":{
        "type":"string",
        "description": "Name of the game"
      },
      "active":{
        "type":"boolean",
        "description": "Whether the game is currently in session"
      },
      "k":{
        "type":"integer",
        "description": "The maximum elo change on a kill"
      },
      "kDecay":{
        "type":"float",
        "description": "The factor by which k is reduced per round",
        "minimum": "0.0",
        "maximum": "1.0"
      },
      "restriction": {
        "type":"integer",
        "desctiption": "The restriction, on either players per rank or # ranks"
      },
      "restrictRanksOrSize": {
        "type": "boolean",
        "description": "true - restrict number of ranks; false - restrict size of ranks"
      },
      "round": {
        "type": "integer",
        "description": "The current rank"
      }
    }
  }
}

var api = {
  index: {
    spec: {
      description : "Game operations",  
      path : "/games",
      method: "GET",
      summary : "Get all games",
      type : "Game",
      nickname : "indexGames",
      produces : ["application/json"]
    }
  },
  show: {
    spec: {
      path : "/games/{gameId}",
      method: "GET",
      summary : "Get a game by ID",
      type : "Game",
      nickname : "showGame",
      produces : ["application/json"],
      parameters: [paramTypes.path("gameId", "ID of game to fetch", "integer")],
      responseMessages : [swe.notFound('Game')]
    }
  },
  create: {
    spec: {
      path : "/games",
      method: "POST",
      summary : "Create a new game",
      nickname : "createGame",
      produces : ["application/json"],
      parameters: [paramTypes.body("body", "Game to create", "Game")],
      responseMessages : [swe.invalid('Game')]
    }
  }
};

module.exports = function(swagger, baseURL) {
  if(baseURL) {
    for(method in api) {
      api[method].spec.path = baseURL + api[method].spec.path;
    }
  }

  swagger.addModels({ models: model });

  swagger.addGet(api.index);
  swagger.addGet(api.show);
  swagger.addPost(api.create);
};