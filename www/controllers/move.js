.controller('MoveCtrl', function($scope, $state) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader, backgroundLayer, layer, tempLocation;

  LInit(20, 'move', w, h, main);

  function main(event) {
    initBackgroundLayer();
    loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load('img/adam.jpg', 'bitmapData');


  }


  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    backgroundLayer.graphics.drawRect(0, '', [0, 0, w, h], true, '#fff');
    addChild(backgroundLayer);
    backgroundLayer.addEventListener(LMouseEvent.MOUSE_DOWN, function(event) {
      tempLocation = {
        x: event.offsetX,
        y: event.offsetY
      };
    })
    backgroundLayer.addEventListener(LMouseEvent.MOUSE_MOVE, function(event) {
      var tempx = event.offsetX - tempLocation.x;
      var tempy = event.offsetY - tempLocation.y;
      layer.x += tempx;
      layer.y += tempy;
      tempLocation = {
        x: event.offsetX,
        y: event.offsetY
      };
    })
    backgroundLayer.addEventListener(LMouseEvent.MOUSE_UP, function(event) {

    })
  }

  function loadBitmapdata(event) {
    var bitmapdata = new LBitmapData(loader.content);
    var bitmap = new LBitmap(bitmapdata);

    layer = new LSprite();
    backgroundLayer.addChild(layer);
    layer.addChild(bitmap);

    bitmap.scaleX = w / bitmap.width;
    bitmap.scaleY = w / bitmap.width;
    layer.x = 50;
    layer.y = 100;
    // layer.rotate = 20;
    layer.alpha = 0.4;
  }

  /**
   * 可以使用div控制canvas中的对象，div是在canvas之上显示的，这样布局就方便多了，可以充分发挥canvas和css的特长
   */
  $scope.hideImage = function() {
    layer.visible = !layer.visible;
  }

  $scope.$on('$ionicView.leave', function() {
    backgroundLayer.removeAllChild();
    backgroundLayer.removeAllEventListener();

  })

  $scope.goToIndex = function() {
    $state.go('index')
  }
})
