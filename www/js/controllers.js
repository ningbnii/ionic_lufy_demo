angular.module('starter.controllers', [])

  .controller('IndexCtrl', function($scope, $state, $ionicModal) {



  })

.controller('DrawCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader;
  var backgroundLayer;

  LInit(requestAnimationFrame, 'draw', w, h, main);


  function main(event) {
    initBackgroundLayer();
    var graphics = new LGraphics();
    backgroundLayer.addChild(graphics);
    // 矩形
    graphics.drawRect(1, '#000000', [50, 50, 100, 100]);
    graphics.drawRect(1, '#000000', [170, 50, 100, 100], true, '#cccccc');

    // 圆形
    graphics.drawArc(1, '#000000', [100, 100, 50, 0, 360 * Math.PI / 180]);
    graphics.drawArc(1, '#000000', [220, 100, 50, 0, 360 * Math.PI / 180], true, '#ff0000')

    // 多边形
    graphics.drawVertices(1, '#000000', [
      [50, 220],
      [80, 220],
      [100, 250],
      [80, 280],
      [50, 280],
      [30, 250]
    ]);

    // canvas原始绘图函数
    graphics.add(function(coodx, coody) {
      LGlobal.canvas.strokeStyle = '#000000';
      LGlobal.canvas.moveTo(150, 300);
      LGlobal.canvas.lineTo(300, 300);
      LGlobal.canvas.stroke();
    })

    // 使用graphics对象绘制图片
    loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load('img/adam.jpg', 'bitmapData');

  }

  function loadBitmapdata(event) {
    var bitmapdata = new LBitmapData(loader.content);
    var layer = new LSprite();
    backgroundLayer.addChild(layer);
    layer.graphics.beginBitmapFill(bitmapdata);
    layer.graphics.drawArc(1, '#000000', [100, 400, 50, 0, Math.PI * 2]);
    layer.graphics.beginBitmapFill(bitmapdata);
    layer.graphics.drawRect(1, '#000000', [200, 350, 100, 100]);

    // 多边形
    layer.graphics.beginBitmapFill(bitmapdata);
    layer.graphics.drawVertices(1, '#000000', [
      [50, 520],
      [80, 520],
      [100, 550],
      [80, 480],
      [50, 480],
      [30, 450]
    ]);
  }

  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
  }


  $scope.$on('$ionicView.leave', function() {
    backgroundLayer.removeAllChild();
  })


  $scope.goToIndex = function() {
    $state.go('index')
  }
})

.controller('DrawTrianglesCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader;
  var backgroundLayer;

  LInit(requestAnimationFrame, 'drawTriangles', w, h, main);


  function main(event) {
    initBackgroundLayer();

    loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load('img/adam.jpg', 'bitmapData');

  }

  function loadBitmapdata(event) {
    var bitmapdata = new LBitmapData(loader.content);
    var bitmap = new LBitmap(bitmapdata);
    var layer = new LSprite();
    layer.addChild(bitmap);
    bitmap.scaleX = w / bitmap.width;
    bitmap.scaleY = w / bitmap.width;
    var x1 = bitmapdata.width;
    var x2 = x1 / 2;
    layer.y = 100;
    backgroundLayer.addChild(layer);

    var vertices = [];
    vertices.push(0, 0);
    vertices.push(0 - 50, x2);
    vertices.push(0, x1);
    vertices.push(x2, 0);
    vertices.push(x2, x2);
    vertices.push(x2, x1);
    vertices.push(x1, 0);
    vertices.push(x1 + 50, x2);
    vertices.push(x1, x1);

    var indices = [];
    indices.push(0, 3, 1);
    indices.push(3, 1, 4);
    indices.push(1, 4, 2);
    indices.push(4, 2, 5);
    indices.push(3, 6, 4);
    indices.push(6, 4, 7);
    indices.push(4, 7, 5);
    indices.push(7, 5, 8);

    var uvtData = [];
    uvtData.push(0, 0);
    uvtData.push(0, 0.5);
    uvtData.push(0, 1);
    uvtData.push(0.5, 0);
    uvtData.push(0.5, 0.5);
    uvtData.push(0.5, 1);
    uvtData.push(1, 0);
    uvtData.push(1, 0.5);
    uvtData.push(1, 1);

    layer.graphics.beginBitmapFill(bitmapdata);
    layer.graphics.drawTriangles(vertices, indices, uvtData);

  }

  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
  }


  $scope.$on('$ionicView.leave', function() {
    backgroundLayer.removeAllChild();
  })


  $scope.goToIndex = function() {
    $state.go('index')
  }
})

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
