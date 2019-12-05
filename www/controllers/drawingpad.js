.controller('DrawingpadCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var backgroundLayer;


  LInit(1, 'drawingpad', w, h, main);


  function main(event) {
    initBackgroundLayer();
    var drawing = new LSprite();
    console.log(drawing.getWidth())
    backgroundLayer.addChild(drawing);
    drawing.graphics.drawRect(0,'',[0,0,w,h],true,'#fff');
    drawing.addEventListener(LMouseEvent.MOUSE_DOWN,onMouseDown)
  }

  function onMouseDown(e) {
    console.log(e)
    // drawing.graphics.moveTo
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
