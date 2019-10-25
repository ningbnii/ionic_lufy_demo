.controller('Image2Ctrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader;
  var backgroundLayer;

  LInit(1, 'mylegend2', w, h, main);


  function main(event) {
    loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load('img/ben.png', 'bitmapData');
  }

  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
    backgroundLayer.graphics.drawRect(1, '#ffffff', [0, 0, w, h], true, '#ffffff');
  }

  function loadBitmapdata(event) {
    var bitmapdata = new LBitmapData(loader.content);
    var bitmap = new LBitmap(bitmapdata);
    var layer = new LSprite();
    addChild(layer);
    layer.x = 50;
    layer.y = 100;
    // layer.rotate = 60;
    layer.addChild(bitmap);
    layer.addEventListener(LMouseEvent.MOUSE_DOWN, function() {
      $state.go('image')
    })
  }

  $scope.$on('$ionicView.leave', function() {
    initBackgroundLayer();
  })
})
