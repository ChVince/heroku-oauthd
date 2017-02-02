var async;

async = require('async');

module.exports = function(app) {
  return app.controller('HelpCtrl', [
    '$scope', '$state', '$rootScope', 'ConfigService', function($scope, $state, $rootScope, ConfigService) {
      return ConfigService.getConfig().then(function(config) {
        return $scope.config = config;
      }).fail(function(e) {
        return console.error(e);
      })["finally"](function() {
        return $scope.$apply();
      });
    }
  ]);
};
