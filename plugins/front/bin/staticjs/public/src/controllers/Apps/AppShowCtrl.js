var async;

async = require('async');

module.exports = function(app) {
  return app.controller('AppShowCtrl', [
    '$state', '$scope', '$rootScope', '$location', '$modal', 'UserService', '$stateParams', 'AppService', function($state, $scope, $rootScope, $location, $modal, UserService, $stateParams, AppService) {
      var timeout, timeoute;
      $scope.domains_control = {};
      $scope.error = void 0;
      $scope.setProvider(void 0);
      $scope.backend = {};
      $scope.original_backend = {};
      $scope.changed = false;
      $scope.$watch('backend', function() {
        if (!angular.equals($scope.backend, $scope.original_backend)) {
          $scope.changed = true;
        }
        return $scope.appModified(!angular.equals($scope.backend, $scope.original_backend));
      }, true);
      $scope.show_secret = false;
      $scope.getAppInfo = function(show_secret) {
        $scope.show_secret = show_secret;
        return AppService.get($stateParams.key).then(function(app) {
          if (!show_secret) {
            app.secret = '••••••••••••••••';
          }
          $scope.app = app;
          $scope.setApp(app);
          $scope.error = void 0;
          $scope.$apply();
          return $scope.domains_control.refresh();
        }).fail(function(e) {
          console.log(e);
          return $scope.error = e.message;
        });
      };
      $scope.getAppInfo(false);
      $scope.resetKeys = function() {
        if (confirm('Are you sure you want to reset this app\'s keys? This will break the code using these keys.')) {
          return AppService.resetKeys($stateParams.key).then(function(data) {
            return $state.go('dashboard.apps.show', {
              key: data.key
            });
          }).fail(function() {
            console.log(e);
            return $scope.error = e.message;
          });
        }
      };
      AppService.getBackend($stateParams.key).then(function(backend) {
        var k, ref, ref1, v;
        $scope.original_backend = {};
        $scope.original_backend.name = backend != null ? backend.name : void 0;
        if (!((ref = $scope.original_backend) != null ? ref.name : void 0)) {
          $scope.original_backend.name = 'none';
        }
        $scope.backend = {};
        ref1 = $scope.original_backend;
        for (k in ref1) {
          v = ref1[k];
          $scope.backend[k] = v;
        }
        console.log($scope.backend);
        return $scope.$apply();
      }).fail(function(e) {
        return console.log(e);
      });
      $scope.saveApp = function() {
        $scope.changed = false;
        $scope.appModified(false);
        return async.series([
          function(cb) {
            return AppService.update($scope.app).then(function() {
              return cb();
            }).fail(function(e) {
              console.log('error', e);
              $scope.error = e.message;
              return cb(e);
            });
          }, function(cb) {
            var ref;
            return AppService.setBackend($stateParams.key, (ref = $scope.backend) != null ? ref.name : void 0).then(function() {
              return cb();
            }).fail(function(e) {
              return cb(e);
            });
          }
        ], function(err) {
          if (err) {
            $scope.error = "A problem occured while saving the app";
          }
          if (err) {
            $scope.changed = true;
          }
          if (err) {
            $scope.appModified(true);
          }
          $scope.success = "Successfully saved changes";
          return $scope.$apply();
        });
      };
      $scope.deleteApp = function() {
        if (confirm('Are you sure you want to delete this app?')) {
          return AppService.del($scope.app).then(function() {
            $state.go('dashboard.apps.all');
            return $scope.error = void 0;
          }).fail(function(e) {
            console.log('error', e);
            return $scope.error = e.message;
          });
        }
      };
      timeout = void 0;
      $scope.$watch('success', function() {
        clearTimeout(timeout);
        if ($scope.success !== void 0) {
          return timeout = setTimeout(function() {
            $scope.success = void 0;
            return $scope.$apply();
          }, 3000);
        }
      });
      timeoute = void 0;
      $scope.$watch('error', function() {
        clearTimeout(timeoute);
        if ($scope.error !== void 0) {
          return timeoute = setTimeout(function() {
            $scope.error = void 0;
            return $scope.$apply();
          }, 3000);
        }
      });
      $scope.domains_control.change = function() {
        $scope.changed = true;
        $scope.appModified(true);
        return $scope.$apply();
      };
      return $scope.tryAuth = function(provider, key) {
        var params, ref, type;
        OAuth.setOAuthdURL(window.location.origin);
        OAuth.initialize(key);
        type = 'client';
        if (((ref = $scope.app.backend) != null ? ref.name : void 0) === 'firebase') {
          type = 'baas';
        }
        if ($scope.app.backend && $scope.app.backend.name !== 'firebase') {
          type = 'server';
        }
        params = {};
        if (type === 'server') {
          params.state = 'azerty';
        }
        return OAuth.popup(provider, params, function(err, res) {
          var instance;
          if (err) {
            instance = $modal.open({
              templateUrl: '/templates/dashboard/modals/try-error.html',
              controller: 'AppTryModalCtrl',
              resolve: {
                success: function() {
                  return res;
                },
                err: function() {
                  return err;
                },
                provider: function() {
                  return provider;
                },
                key: function() {
                  return key;
                },
                type: function() {
                  return type;
                },
                backend: function() {
                  var ref1;
                  return (ref1 = $scope.app.backend) != null ? ref1.name : void 0;
                }
              }
            });
            console.log(err);
            return false;
          }
          console.log(res);
          return instance = $modal.open({
            templateUrl: '/templates/dashboard/modals/try-success.html',
            controller: 'AppTryModalCtrl',
            resolve: {
              success: function() {
                return res;
              },
              err: function() {
                return err;
              },
              provider: function() {
                return provider;
              },
              key: function() {
                return key;
              },
              type: function() {
                return type;
              },
              backend: function() {
                var ref1;
                return (ref1 = $scope.app.backend) != null ? ref1.name : void 0;
              }
            }
          });
        });
      };
    }
  ]);
};
