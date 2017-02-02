module.exports = function(app) {
  return app.controller('AppKeysetCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', '$stateParams', 'AppService', 'ProviderService', 'KeysetService', function($state, $scope, $rootScope, $location, UserService, $stateParams, AppService, ProviderService, KeysetService) {
      $scope.keyset = {
        parameters: {}
      };
      $scope.keysetEditorControl = {};
      $scope.provider = $stateParams.provider;
      $scope.changed = false;
      AppService.get($stateParams.key).then(function(app) {
        $scope.app = app;
        $scope.setApp(app);
        $scope.setProvider($stateParams.provider);
        return $scope.$apply();
      }).fail(function(e) {
        return console.error(e);
      });
      KeysetService.get($stateParams.key, $scope.provider).then(function(keyset) {
        var k, ref, v;
        $scope.keyset = keyset;
        $scope.original = {};
        ref = $scope.keyset.parameters;
        for (k in ref) {
          v = ref[k];
          $scope.original[k] = v;
        }
        $scope.keysetEditorControl.setKeyset($scope.keyset);
      }).fail(function(e) {
        return $scope.keysetEditorControl.setKeyset($scope.keyset);
      });
      $scope.save = function() {
        var keyset;
        keyset = $scope.keysetEditorControl.getKeyset();
        return KeysetService.save($scope.app.key, $stateParams.provider, keyset.parameters).then(function(data) {
          return $state.go('dashboard.apps.show', {
            key: $stateParams.key
          });
        }).fail(function(e) {
          return console.error(e);
        });
      };
      $scope["delete"] = function() {
        if (confirm('Are you sure you want to delete this keyset?')) {
          return KeysetService.del($scope.app.key, $stateParams.provider).then(function(data) {
            return $state.go('dashboard.apps.show', {
              key: $stateParams.key
            });
          }).fail(function(e) {
            return console.error(e);
          });
        }
      };
      ProviderService.getProviderSettings($stateParams.provider).then(function(settings) {
        return $scope.settings = settings;
      }).fail(function(e) {
        return consoe.log('e', e);
      });
      return $scope.keysetEditorControl.change = function() {
        $scope.changed = !angular.equals($scope.original, $scope.keysetEditorControl.getKeyset().parameters);
        return $scope.$apply();
      };
    }
  ]);
};
