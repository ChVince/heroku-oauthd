var async;

async = require('async');

module.exports = function(app) {
  return app.controller('AppsIndexCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', '$stateParams', 'AppService', function($state, $scope, $rootScope, $location, UserService, $stateParams, AppService) {
      var reloadApps;
      $scope.clearArianne();
      $scope.loadingApps = true;
      $scope.apps = [];
      reloadApps = function() {
        return AppService.all().then(function(apps) {
          return async.each(apps, function(app, cb) {
            return AppService.get(app.key).then(function(a) {
              $scope.apps.push(a);
              return cb();
            }).fail(function(e) {
              return console.error(e);
            });
          }, function(err) {
            return $scope.$apply();
          });
        }).fail(function(e) {
          return console.error(e);
        })["finally"](function() {
          $scope.loadingApps = false;
          return $scope.$apply();
        });
      };
      reloadApps();
      return $scope.deleteApp = function(key) {
        if (confirm('Are you sure you want to delete this app?')) {
          return AppService.del({
            key: key
          }).then(function() {
            return reloadApps();
          }).fail(function() {
            return console.error(e);
          });
        }
      };
    }
  ]);
};
