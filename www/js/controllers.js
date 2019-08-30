angular.module('starter.controllers', [])

  .controller('DashCtrl', function($scope, $state, $ionicModal) {
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;
    console.log(window);
    var angle = 0;
    var radius = 100;
    var speed = 0.05;
    var backlayer, ball;
    var stop = false;
    $scope.btn_txt = '暂停';

    LInit(10, 'mylegend', w, h, init);

    function init(event) {
      backlayer = new LSprite();
      addChild(backlayer);
      ball = new LSprite();
      backlayer.addChild(ball);
      ball.graphics.drawArc(1, '#000000', [w / 2, h / 2, 20, 0, 2 * Math.PI], true, '#000000');


      ball.addEventListener(LMouseEvent.MOUSE_DOWN, onMouseDown);
      backlayer.addEventListener(LEvent.ENTER_FRAME, onEnterFrame);
    }

    function onEnterFrame(event) {
      if (!stop) {

        ball.x = Math.sin(angle) * radius;
        ball.y = Math.cos(angle) * radius;
        angle += speed;

      }
    }

    function onMouseDown(event) {
      $scope.modal.show();
      stop = true;
      // $state.go('tab.chats')
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;

    });
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.closeModal = function() {
      $scope.modal.hide();
      stop = false;
    };

    $scope.stop = function() {
      stop = stop ? false : true;
      $scope.btn_txt = stop ? '开始' : '暂停';
    }
  })

  .controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
