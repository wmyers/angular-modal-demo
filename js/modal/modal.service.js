'use strict';

angular.module('modalComp')
  .factory('ModalService', function () {

    var showModal = function(config) {
      self.config = config;
      self.shown = true;
      self.cancellable = config.cancellable || false;
    };

    var resetModal = function(){
      self.shown = false;
      self.config = null;
      self.cancellable = true;
    };

    var self = {
      show: showModal,
      reset: resetModal
    };

    self.reset();

    return self;
  });
