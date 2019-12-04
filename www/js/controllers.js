angular.module('starter.controllers', [])

  .controller('IndexCtrl', function($scope, $state, $ionicModal) {


  })

.controller('AnimationCtrl', function($scope, $state) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;

  LInit(requestAnimationFrame, 'animation', w, h, main);

  var backgroundLayer, player, player2;
  var walkDown = true;
  var i = 0;

  function main(event) {
    initBackgroundLayer();
    var loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load('img/player.png', 'bitmapData');
  }

  function loadBitmapdata(event) {
    var backLayer = new LSprite();
    backgroundLayer.addChild(backLayer);
    var list = LGlobal.divideCoordinate(480, 630, 3, 4);
    var data = new LBitmapData(event.target, 0, 0, 120, 210);
    player = new LAnimation(backLayer, data, list);

    player.y = -player.bitmap.height;
    player.x = (w - player.bitmap.width) / 2;

    backgroundLayer.addEventListener(LEvent.ENTER_FRAME, onEnterFrame);
  }

  function onEnterFrame(event) {
    player.onframe();
    if (walkDown) {
      if (player.y < h) {
        player.y += 10;
      }
    }
    if (!walkDown) {
      player.y -= 10;
    }

    if (player.y >= h) {
      walkDown = false;
      player.setAction(1, 0);
    }
    if (player.y <= -player.bitmap.height) {
      player.setAction(0, 0);
      walkDown = true;
    }


  }


  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
  }




  $scope.$on('$ionicView.leave', function() {
    backgroundLayer.removeAllChild();
    backgroundLayer.removeAllEventListener();

  })

  $scope.goToIndex = function() {
    $state.go('index')
  }
})

.controller('DrawCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader;
  var backgroundLayer;
  var i = 0;

  LInit(50, 'draw', w, h, main);


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

    backgroundLayer.addEventListener(LEvent.ENTER_FRAME, onframe)

  }

  function onframe() {

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
    backgroundLayer.removeAllEventListener()
  })


  $scope.goToIndex = function() {
    $state.go('index')
  }
})

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

.controller('DrawTrianglesCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader;
  var backgroundLayer;

  LInit(50, 'drawTriangles', w, h, main);


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
    backgroundLayer.removeAllEventListener();
  })


  $scope.goToIndex = function() {
    $state.go('index')
  }
})

.controller('ImageCtrl', function($scope, $state) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader, backgroundLayer, layer;

  LInit(50, 'image', w, h, main);

  function main(event) {
    initBackgroundLayer();
    loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load('img/adam.jpg', 'bitmapData');

    // pc端监听键盘事件
    LEvent.addEventListener(LGlobal.window, LKeyboardEvent.KEY_DOWN, downshow);
  }

  function downshow(event) {
    alert(event.keyCode)
  }

  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
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
    layer.rotate = 20;
    layer.alpha = 0.4;


    layer.addEventListener(LMouseEvent.MOUSE_DOWN, function() {
      alert('ok')
    })




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

.controller('MoveCtrl', function($scope, $state) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader, backgroundLayer, layer, tempLocation;

  LInit(requestAnimationFrame, 'move', w, h, main);

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

.
controller('SwiperCtrl', function($scope, $state, $timeout) {

  $scope.list = [{
      id: 'slider1',
      img: 'img/adam.jpg',
      color: 'rgba(0,0,0)',
    },
    {
      id: 'slider2',
      img: 'img/ben.png',
      color: 'rgba(255,0,0)',
    },
    {
      id: 'slider3',
      img: 'img/mike.png',
      color: 'rgba(255,255,0)',
    }
  ];
  var color = 'rgba(0,0,0)';
  var img = $scope.list[0].img;
  var mySwiper = new Swiper('.swiper-container', {
    autoplay: false, //可选选项，自动滑动
    direction: 'vertical',
    observer: true, //修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, //修改swiper的父元素时，自动初始化swiper
    on: {
      slideChange: function() {

        backgroundLayer.removeAllChild();
        backgroundLayer.removeAllEventListener();
        if (LGlobal.frameRate) {
          // 切换页面，动画会越来越快，应该是在切换页面后，之前的计时器没有清除导致的
          clearInterval(LGlobal.frameRate)
        }
        LInit(50, $scope.list[this.activeIndex].id, w, h, main);
        color = $scope.list[this.activeIndex].color;
        img = $scope.list[this.activeIndex].img;

      },
      slideNextTransitionStart: function() {
        // 从后台搞一个新数据，push到数组中
        $scope.list.push({
          id: 'slider4',
          img: 'img/mike.png',
          color: 'rgba(0,255,0)',
        })
        $scope.$apply();
      },
      slidePrevTransitionStart: function() {
        // 监听第一个滑动
      }

    }
  })


  var w = document.body.clientWidth;
  var h = document.body.clientHeight;


  $timeout(function() {
    if (LGlobal.frameRate) {
      // 切换页面，动画会越来越快，应该是在切换页面后，之前的计时器没有清除导致的
      clearInterval(LGlobal.frameRate)
    }
    LInit(50, 'slider1', w, h, main);
  }, 0)


  var backgroundLayer, loader;


  function main(event) {
    initBackgroundLayer();
    // backgroundLayer.graphics.drawRect(0, '', [0, 0, w, h], true, color);
    loader = new LLoader();
    loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
    loader.load(img, 'bitmapData');
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
    layer.rotate = 20;
    layer.alpha = 0.4;

  }

  function initBackgroundLayer() {
    backgroundLayer = new LSprite();
    addChild(backgroundLayer);
  }


  $scope.$on('$ionicView.leave', function() {
    backgroundLayer.removeAllChild();
    backgroundLayer.removeAllEventListener();
  })

  $scope.goToIndex = function() {
    $state.go('index')
  }
})
