.controller('ImageCtrl', function($scope) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader;

  LInit(1, 'mylegend', w, h, main);

  function main(event) {
    loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load('img/ionic.png', 'bitmapData');
  }

  function loadBitmapdata(event) {
    var bitmapdata = new LBitmapData(loader.content);
    var bitmap = new LBitmap(bitmapdata);
    var layer = new LSprite();
    addChild(layer);
    layer.x = 50;
    layer.y = 100;
    layer.rotate = 60;
    layer.addChild(bitmap);
  }
})
