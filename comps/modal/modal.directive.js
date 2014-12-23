'use strict';

angular.module('modalComp')
.directive('modal', function($rootScope) {
  return {
    restrict: 'EA',
    scope: {},
    transclude: true,
    controller: function($scope, ModalService){
      //putting the data/service in the $scope directly, Angular will handle changes for you.
      $scope.service = ModalService;
      //service api for simpleModalContent child directives
      this.getService = function(){
        return $scope.service;
      };
    },
    link: function(scope, element, attrs) {
      scope.okButtonClick = function(){
        //broadcast ok event from root with clone of service.config
        $rootScope.$broadcast(
          'modalOKClickEvent',
          _.clone(scope.service.config));

        //reset values in the service
        scope.service.reset();
      };

    },
    template: '<div class="modal" ng-show="service.shown">' +
                '<div class="modal-overlay" ng-click="service.reset()"></div>' +
                '<div class="modal-dialog">' +
                  '<div class="modal-close" ng-click="service.reset()">x</div>' +
                  '<div class="modal-dialog-content" ng-transclude></div>' +
                  '<div class="modal-buttons">' +
                    '<a class="modal-button" ng-click="okButtonClick()">OK</a>' +
                    '<a class="modal-button" ng-click="service.reset()" ng-show="service.cancellable">Cancel</a>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
})
.directive('modalContent', function() {
  return {
    require: '^modal',
    restrict: 'E',
    transclude: true,
    scope: {},
    link: function(scope, element, attrs, modalCtrl) {
      //bind the service variable to the service exposed
      //by the parent directive - this is more encapsulated
      scope.service = modalCtrl.getService();
      scope.props = {
        contentId: element[0].id
      };
    },
    template: '<div class="modal-content" '+
    'ng-show="service.config.contentId === props.contentId" '+
    'ng-transclude></div>'
  };
});
