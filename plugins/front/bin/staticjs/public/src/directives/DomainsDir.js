module.exports = function(app) {
  return app.directive('domains', [
    "$rootScope", function($rootScope) {
      return {
        restrict: 'AE',
        templateUrl: '/templates/domains_chooser.html',
        replace: true,
        scope: {
          control: '=',
          app: '='
        },
        link: function($scope, $element) {
          var add_listener, k, ref, ref1, remove_listener, selectize_elem, v;
          selectize_elem = $($element[0]).selectize({
            delimiter: ' ',
            persist: false,
            create: function(input) {
              return {
                value: input,
                text: input
              };
            }
          });
          $scope.selectize = selectize_elem[0].selectize;
          $scope.control.getSelectize = function() {
            return $scope.selectize;
          };
          $scope.control.getDomains = function() {
            var domains, value;
            value = $scope.selectize.getValue();
            domains = value.split(' ');
            return domains;
          };
          if (((ref = $scope.app) != null ? ref.domains : void 0) != null) {
            ref1 = $scope.app.domains;
            for (k in ref1) {
              v = ref1[k];
              $scope.selectize.addOption({
                text: v,
                value: v
              });
              $scope.selectize.addItem(v);
            }
          }
          add_listener = function() {
            return $scope.selectize.on('change', function() {
              var domains, value;
              value = $scope.selectize.getValue();
              domains = value.split(' ');
              $scope.app.domains = domains;
              if ($scope.control.change != null) {
                return $scope.control.change();
              }
            });
          };
          remove_listener = function() {
            return $scope.selectize.off('change');
          };
          $scope.control.refresh = function(app) {
            var i, len, ref2;
            remove_listener();
            $scope.selectize.clear();
            if (app != null) {
              $scope.app = app;
            }
            ref2 = $scope.app.domains;
            for (i = 0, len = ref2.length; i < len; i++) {
              v = ref2[i];
              $scope.selectize.addOption({
                text: v,
                value: v
              });
              $scope.selectize.addItem(v);
            }
            return add_listener();
          };
          add_listener();
        }
      };
    }
  ]);
};
