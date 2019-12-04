.controller('DrawingpadCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var backgroundLayer;

  LInit(50, 'drawingpad', w, h, main);


  function main(event) {
    initBackgroundLayer();
  }

  function onframe() {

  }


  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    backgroundLayer.graphics.drawRect(0, '', [0, 0, w, h], true, '#fff');
    addChild(backgroundLayer);
  }


  $scope.$on('$ionicView.leave', function() {
    backgroundLayer.removeAllChild();
    backgroundLayer.removeAllEventListener()
  })


  $scope.goToIndex = function() {
    $state.go('index')
  }
})
