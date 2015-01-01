var swag       = require("swagger-node-express");
var paramTypes = swag.paramTypes;
var swe        = swag.errors;

var model = {
  "User":{
    "id":"User",
    "required": ["name"],
    "properties":{
      _id: {
        "type":"integer",
        "format": "int64",
        "description": "User unique identifier"
      },
      name: {
        "type":"string",
        "description": "Name of the game"
      },
      email: {
        "type":"string",
        "description": "User unique email"
      },
      role: {
        "type":"string",
        "description": "User role"
      },
      password: {
        "type":"string",
        "description": "User password"
      },
      provider: {
        "type":"string",
        "description": "Where the user came from (Google, Facebook, local)"
      },
      facebook: {
        "type":"string",
        "description": "User's Facebook profile"
      },
      github: {
        "type":"string",
        "description": "User's Facebook profile"
      }
    }
  }
}

var api = {
  index: {
    spec: {
      description : "User operations",  
      path : "/users",
      method: "GET",
      summary : "Get all users. *Admin-only operation*",
      type : "User",
      nickname: 'getUsers',
      parameters: [paramTypes.query("access_token", "Token of logged in user", "string")],
      produces : ["application/json"]
    }
  },
  deleteUser: {
    spec: {
      path : "/users/{userId}",
      method: "DELETE",
      summary : "Delete a user. *Admin-only operation*",
      nickname: 'deleteUser',
      parameters: [paramTypes.path("userId", "ID of user to delete", "integer"),
        paramTypes.query("access_token", "Token of logged in user", "string")],
      produces : ["application/json"]
    }
  },
  me: {
    spec: {
      path : "/users/me",
      method: "GET",
      summary : "Get logged in user",
      type : "User",
      nickname : "meUser",
      produces : ["application/json"],
      parameters: [paramTypes.query("access_token", "Token of logged in user", "string")]
    }
  },
  show: {
    spec: {
      path : "/users/{userId}",
      method: "GET",
      summary : "Get a user by ID",
      type : "User",
      nickname : "showUser",
      produces : ["application/json"],
      parameters: [paramTypes.path("userId", "ID of user to fetch", "integer"),
        paramTypes.query("access_token", "Token of logged in user", "string")],
      responseMessages : [swe.notFound('User')]
    }
  },
  create: {
    spec: {
      path : "/users",
      method: "POST",
      summary : "Create a new user",
      nickname : "createUser",
      produces : ["application/json"],
      parameters: [paramTypes.body("body", "User to create", "User")],
      responseMessages : [swe.invalid('User')]
    }
  },
  changePassword: {
    spec: {
      path : "/users/{userId}/password",
      method: "PUT",
      summary : "Change logged in user's password",
      type : "User",
      nickname : "changePassword",
      produces : ["application/json"],
      parameters: [paramTypes.path("userId", "toootally useless", "integer"),
        paramTypes.body("body", "old and new passwords", {
          oldPassword: "",
          newPassword: ""
        }),
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

  swagger.addGet(api.index);
  swagger.addDelete(api.deleteUser);
  swagger.addGet(api.me);
  swagger.addGet(api.show);
  swagger.addPut(api.me);
  swagger.addPost(api.create);
};