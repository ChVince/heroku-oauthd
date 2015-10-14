var async;

async = require('async');

module.exports = function(app) {
  return app.controller('DashboardCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', 'AppService', 'PluginService', function($state, $scope, $rootScope, $location, UserService, AppService, PluginService) {
      var ref;
      if (($rootScope.accessToken == null) || ((ref = $rootScope.loginData) != null ? ref.expires : void 0) < new Date().getTime()) {
        $state.go('login');
      }
      PluginService.getAll().then(function(plugins) {
        var k, v;
        $scope.plugins = plugins;
        $scope.interface_enabled = 0;
        for (k in plugins) {
          v = plugins[k];
          if (v.interface_enabled) {
            $scope.interface_enabled++;
          }
        }
        return $scope.$apply();
      }).fail(function(e) {
        return console.log(e);
      });
      return $scope.state = $state;
    }
  ]);
};
