var express = require('express'),
  router = express.Router(),
  uuid = require('node-uuid'),
  utils = require('./../utils/utils');
//resources = require('./../resources/pi.json');

exports.create = function (model) {

  //TODO: Do we really need this? Isn't this injected by the plugins?
  createDefaultData(model.links.properties.resources);
  createDefaultData(model.links.actions.resources);

  createModelRoutes(model);
  createPropertiesRoutes(model.links.properties);
  createActionsRoutes(model.links.actions);

  return router;
};

function createModelRoutes(model) {
  // GET /model
  router.route('model').get(function (req, res, next) {
    req.result = model;
    next();
  });
};

function createPropertiesRoutes(properties) {
  // GET /properties
  router.route(properties.link).get(function (req, res, next) {
    //TODO: must fetch the array of all data for all resources
    req.result = properties.resources;
    next();
  });

  // GET /properties/{id}
  router.route(properties.link + ':id').get(function (req, res, next) {
    req.result = properties.resources[req.params.id].data;
    next();
  });
};

function createActionsRoutes(actions) {
  // GET /actions
  router.route(actions.link).get(function (req, res, next) {

    //TODO: must fetch the array of all data for all resources
    req.result = actions.resources;
    next();
  });

  // POST /actions/{actionType}
  router.route(actions.link + '/:actionType').post(function (req, res, next) {
    var action = req.body;
    action.id = uuid.v1();
    actions.resources[req.params.actionType].data.push(action);
    req.result = actions.resources;
    next();
  });

  // GET /actions/{actionType}
  router.route(actions.link + '/:actionType').get(function (req, res, next) {
    req.result = actions.resources[req.params.actionType].data;
    next();
  });

  // GET /actions/{id}/{actionId}
  router.route(actions.link + '/:actionType/:actionId').get(function (req, res, next) {
    utils.findObjectInArray(actions.resources[req.params.actionType].data,
      req.params.actionId, function(result) {
        //TODO: what happens if it is isn't found? Hangs forever now...
        req.result = result;
        next();
      });
  });
};

function createSubscriptionsRoutes() {
  //TODO
};

function createDefaultData(resources) {
  // Add the latest values to the model
  Object.keys(resources).forEach(function (resKey) {
    var resource = resources[resKey];
    //Object.keys(resource.values).forEach(function(valKey) {
    resource.data = [];
    //var value = {};
    //  value[valKey] = 'hello';
    //resource.data.push(value);
    //});
  });
}