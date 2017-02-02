module.exports = function(app) {
  return app.controller('PluginShowCtrl', [
    '$state', '$scope', '$stateParams', 'PluginService', function($state, $scope, $stateParams, PluginService) {
      if (!$stateParams.plugin || $stateParams.plugin === "") {
        $state.go('home');
      }
      return PluginService.get($stateParams.plugin).then(function(plugin) {
        if (plugin.interface_enabled) {
          plugin.url = "/plugins/" + plugin.name + '/index.html';
        }
        return $scope.plugin = plugin;
      }).fail(function(e) {
        return console.error(e);
      })["finally"](function() {
        return $scope.$apply();
      });
    }
  ]);
};
