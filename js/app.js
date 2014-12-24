'use strict';

/**
* http://www.hiddentao.com/archives/2013/11/04/an-improved-angular-module-split-your-modules-into-multiple-files/
* Workaround to make defining and retrieving angular modules easier and more intuitive.
* WM: NB this also will prevent 'module not found error' by always creating a module
* if it does not already exist, but also allowing more dependencies to be added.
*/

(function(angular) {
  var origMethod = angular.module;

  var alreadyRegistered = {};

  /**
  * Register/fetch a module.
  *
  * @param name {string} module name.
  * @param reqs {array} list of modules this module depends upon.
  * @param configFn {function} config function to run when module loads (only applied for the first call to create this module).
  * @returns {*} the created/existing module.
  */
  angular.module = function(name, reqs, configFn) {
    //WM added for debugging
    var isReqs = (reqs && reqs.length !== undefined);
    reqs = reqs || [];
    var module = null;

    //debugger
    //console.log('*&*&*&*&*&*&*&*&', (isReqs ? 'initing' : 'accessing'), 'module', name);

    if (alreadyRegistered[name]) {
      module = origMethod(name);
      module.requires.push.apply(module.requires, reqs);
    } else {
      module = origMethod(name, reqs, configFn);
      alreadyRegistered[name] = module;
    }

    return module;
  };

})(angular);

//************************************************

angular.module('modalDemo', ['modalComp'])
.controller('modalDemoCtrl',
                            [
                            '$scope',
                            'ModalService',
                            function (
                              $scope,
                              ModalService
                            ) {

            //config attached to modal OK button click events
            $scope.modalOKConfig = null;

            $scope.launchModal = function(contentId, targetId, cancellable){
              $scope.modalOKConfig = null;
              targetId = targetId || 0;
              cancellable = cancellable || false;
              var config = { contentId:contentId, targetId:targetId, cancellable:cancellable };
              ModalService.show(config);
            };

            //listen for all modal OK click events, broadcast from the $rootScope downwards
            $scope.$on(
              'modalOKClickEvent',
              function(event, config){
                //bind the OK click event config
                $scope.modalOKConfig = config;
              });

}]);
