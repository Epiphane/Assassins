var swag       = require("swagger-node-express");
var paramTypes = swag.paramTypes;
var swe        = swag.errors;

var model = {
  "Kill":{
    "id":"Kill",
    "required": ["_id", "name"],
    "properties":{
      "_id":{
        "type":"integer",
        "format": "int64",
        "description": "Kill unique identifier"
      },
      "name":{
        "type":"string",
        "description": "Name of the kill"
      },
      "active":{
        "type":"boolean",
        "description": "Whether the kill is currently in session"
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
      description : "Kill operations",  
      path : "/kills",
      method: "GET",
      summary : "Get all kills",
      type : "Kill",
      nickname : "indexKills",
      produces : ["application/json"]
    }
  },
  show: {
    spec: {
      path : "/kills/{killId}",
      method: "GET",
      summary : "Get a kill by ID",
      type : "Kill",
      nickname : "showKill",
      produces : ["application/json"],
      parameters: [paramTypes.path("killId", "ID of kill to fetch", "integer")],
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
};