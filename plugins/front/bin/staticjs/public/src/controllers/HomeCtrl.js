var async;

async = require('async');

module.exports = function(app) {
  return app.controller('HomeCtrl', [
    '$scope', '$state', '$rootScope', '$location', 'UserService', 'AppService', 'PluginService', 'ConfigService', function($scope, $state, $rootScope, $location, UserService, AppService, PluginService, ConfigService) {
      var initCtrl;
      $scope.count = function(object) {
        var count, k, v;
        count = 0;
        for (k in object) {
          v = object[k];
          count++;
        }
        return count;
      };
      initCtrl = function() {
        $scope.providers = {};
        $scope.loadingApps = true;
        AppService.all().then(function(apps) {
          $scope.apps = apps;
          return async.eachSeries(apps, function(app, next) {
            return AppService.get(app.key).then(function(app_data) {
              var j, k, ref, v;
              for (j in app_data) {
                app[j] = app_data[j];
              }
              ref = app_data.keysets;
              for (k in ref) {
                v = ref[k];
                $scope.providers[v] = true;
              }
              return next();
            }).fail(function(e) {
              console.log(e);
              return next();
            });
          }, function(err) {
            return $scope.$apply();
          });
        }).fail(function(e) {
          return console.log("HomeCtrl getAllApps error ", e);
        })["finally"](function() {
          $scope.loadingApps = false;
          return $scope.$apply();
        });
        PluginService.getAll().then(function(plugins) {
          var i, len, plugin, results;
          $scope.plugins = [];
          results = [];
          for (i = 0, len = plugins.length; i < len; i++) {
            plugin = plugins[i];
            plugin.url = "/oauthd/plugins/" + plugin.name;
            results.push($scope.plugins.push(plugin));
          }
          return results;
        }).fail(function(e) {
          return console.log(e);
        })["finally"](function() {
          return $scope.$apply();
        });
        $scope.loadingConfig = true;
        return ConfigService.getConfig().then(function(config) {
          return $scope.config = config;
        }).fail(function(e) {
          return console.log("HomeCtrl getConfig error", e);
        })["finally"](function() {
          $scope.loadingConfig = false;
          return $scope.$apply();
        });
      };
      return initCtrl();
    }
  ]);
};
