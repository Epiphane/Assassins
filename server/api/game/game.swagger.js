var swag       = require("swagger-node-express");
var paramTypes = swag.paramTypes;
var swe        = swag.errors;

var model = {
  "Game":{
    "id":"Game",
    "required": ["name"],
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
  },
  Player: {
    id: "Player",
    properties: {
      elo: {
        "type":"integer",
        "description": "The player's elo"
      },
      active: {
        "type": "boolean",
        description: "Whether the player is playing"
      },
      rank: {
        type: "integer",
        description: "Battle rank for then player"
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
      parameters: [paramTypes.path("gameId", "ID of game to fetch", "integer")]
    }
  },
  create: {
    spec: {
      path : "/games",
      method: "POST",
      summary : "Create a new game",
      nickname : "createGame",
      produces : ["application/json"],
      parameters: [paramTypes.query("access_token", "Token of logged in user", "string"),
        paramTypes.body("body", "Game to create", "Game")],
    }
  },
  update: {
    spec: {
      path : "/games/{gameId}",
      method: "PUT",
      summary : "Update game information",
      type : "Game",
      nickname : "showGame",
      produces : ["application/json"],
      parameters: [paramTypes.path("gameId", "ID of game to fetch", "integer"),
        paramTypes.query("access_token", "Token of logged in user", "string"),
        paramTypes.body("body", "Game information to update", "Game")],
    }
  },
  showRound: {
    spec: {
      description : "Round operations",  
      path : "/games/{gameId}/round",
      method: "GET",
      summary : "See details on current round",
      type : "Round",
      nickname : "showRound",
      produces : ["application/json"],
      parameters: [paramTypes.path("gameId", "ID of game", "integer")]
    }
  },
  startRound: {
    spec: {
      path : "/games/{gameId}/round",
      method: "POST",
      summary : "Start a new round",
      type : "Round",
      nickname : "startRound",
      produces : ["application/json"],
      parameters: [paramTypes.path("gameId", "ID of game", "integer"),
        paramTypes.query("access_token", "Token of logged in user", "string")]
    }
  },
  indexKills: {
    spec: {
      description : "Kill operations",  
      path : "/games/{gameId}/kills",
      method: "GET",
      summary : "Get all kills in a game",
      type : "Kill",
      nickname : "indexKills",
      produces : ["application/json"],
      parameters: [paramTypes.path("gameId", "ID of game", "integer")]
    }
  },
  createKill: {
    spec: {
      path : "/games/{gameId}/kills/{victimId}",
      method: "POST",
      summary : "Kill another player",
      nickname : "createKill",
      produces : ["application/json"],
      parameters: [paramTypes.path("gameId", "ID of game", "integer"),
        paramTypes.path("victimId", "ID of User to kill", "integer"),
        paramTypes.query("access_token", "Token of logged in user", "string")],
    }
  },
  indexPlayers: {
    spec: {
      description : "Player operations",  
      path : "/games/{gameId}/players",
      method: "GET",
      summary : "Get all player in the game",
      type : "Player",
      nickname : "indexPlayers",
      produces : ["application/json"],
      parameters: [paramTypes.path("gameId", "ID of game", "integer")]
    }
  },
  joinGame: {
    spec: {
      path: "/games/{gameId}/players",
      method: "POST",
      summary: "Join a game",
      nickname: "joinGame",
      produces: ["application/text"],
      parameters: [paramTypes.path("gameId", "ID of game to join", "integer"),
        paramTypes.query("access_token", "Token of logged in user", "string")]
    }
  },
  leaveGame: {
    spec: {
      path: "/games/{gameId}/players",
      method: "DELETE",
      summary: "Leave a game",
      nickname: "leaveGame",
      produces: ["application/text"],
      parameters: [paramTypes.path("gameId", "ID of game to leave", "integer"),
        paramTypes.query("access_token", "Token of logged in user", "string")]
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

  swagger.addGet   (api.index);
  swagger.addGet   (api.show);
  swagger.addGet   (api.showRound);
  swagger.addGet   (api.indexKills);
  swagger.addGet   (api.indexPlayers);
  swagger.addPost  (api.create);
  swagger.addPost  (api.startRound);
  swagger.addPost  (api.createKill);
  swagger.addPost  (api.joinGame);
  swagger.addPut   (api.update);
  swagger.addDelete(api.leaveGame);
};