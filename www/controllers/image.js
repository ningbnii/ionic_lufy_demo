.controller('ImageCtrl', function($scope, $state) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader, backgroundLayer;

  LInit(requestAnimationFrame, 'image', w, h, main);

  function main(event) {
    initBackgroundLayer();
    loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load('img/adam.jpg', 'bitmapData');
  }

  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
  }

  function loadBitmapdata(event) {
    var bitmapdata = new LBitmapData(loader.content);
    var bitmap = new LBitmap(bitmapdata);

    var layer = new LSprite();
    backgroundLayer.addChild(layer);
    layer.addChild(bitmap);

    bitmap.scaleX = w / bitmap.width;
    bitmap.scaleY = w / bitmap.width;
    layer.x = 50;
    layer.y = 100;
    layer.rotate = 20;
    layer.alpha = 0.4;


    // layer.addEventListener(LMouseEvent.MOUSE_DOWN, function() {
    //   $state.go('image2')
    // })


  }

  $scope.$on('$ionicView.leave', function() {
    backgroundLayer.removeAllChild();
  })

  $scope.goToIndex = function() {
    $state.go('index')
  }
})
