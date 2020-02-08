angular.module('starter.controllers', [])

  .controller('IndexCtrl', function($scope, $state, $ionicModal) {


  })

.controller('AnimationCtrl', function($scope, $state) {
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;

  LInit(100, 'animation', w, h, main);

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
    // console.log(LGlobal.requestIdArr)
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
    // window.cancelAnimationFrame(LGlobal.requestId)
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

  LInit(20, 'draw', w, h, main);


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

.
controller('DrawingpadCtrl', function ($scope, $state) {

	var w = document.body.clientWidth;
	var h = document.body.clientHeight;
	var backgroundLayer, drawingLayer;
	var isDrawing, lastPoint;
	var points = [];
	var bitmap1;
	var bitmapdata1;
	var ctx;
	var lineWidth = 1;
	var touchPointIdList = []; // 触点数组
  var scaleLenOld; // 双指间距，用于计算缩放比例
  var lastScale; // 初始缩放比


	LInit(requestAnimationFrame, 'drawingpad', w, h, main);


	function main(event) {
		LMultitouch.inputMode = LMultitouchInputMode.TOUCH_POINT;
		initBackgroundLayer();
		bitmapdata1 = new LBitmapData('#fff', 0, 0, w, h, LBitmapData.DATA_CANVAS);
		ctx = bitmapdata1._canvas.getContext('2d');
		ctx.lineJoin = ctx.lineCap = 'round';
		bitmap1 = new LBitmap(bitmapdata1);

		drawingLayer = new LSprite();
		backgroundLayer.addChild(drawingLayer);

    drawingLayer.x = bitmap1.getWidth() / 2;
    drawingLayer.y = bitmap1.getHeight() / 2;

		bitmap1.x = -bitmap1.getWidth() / 2;
		bitmap1.y = -bitmap1.getHeight() / 2;

		drawingLayer.addChild(bitmap1);

    backgroundLayer.addEventListener(LMouseEvent.MOUSE_DOWN, onMouseDown);
    backgroundLayer.addEventListener(LMouseEvent.MOUSE_MOVE, onMouseMove);
    backgroundLayer.addEventListener(LMouseEvent.MOUSE_UP, onMouseUp);
	}


	function onMouseDown(e) {
		initTouchPoint(e);
		// 单指绘画
		if (touchPointIdList.length == 1) {
			isDrawing = true;
			ctx.lineWidth = lineWidth;
			points.push({x: e.selfX, y: e.selfY});
		} else if (touchPointIdList.length == 2) {
			// 双指移动缩放旋转
      var point1 = new LPoint(touchPointIdList[0].selfX,touchPointIdList[0].selfY);
      var point2 = new LPoint(touchPointIdList[1].selfX,touchPointIdList[1].selfY);

      scaleLenOld = distanceBetween(point1,point2);
      lastScale = drawingLayer.scaleX;
		}

	}

	function onMouseMove(e) {
		// 更新触点坐标
		initTouchPoint(e);
		if (touchPointIdList.length == 1) {
			// 绘画

			if (!isDrawing) return;
			points.push({x: e.selfX, y: e.selfY});
			ctx.clearRect(0, 0, w, h);

			var p1 = points[0];
			var p2 = points[1];

			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);

			for (var i = 0; i < points.length; i++) {
				var midPoint = midPointBtw(p1, p2);
				ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
				p1 = points[i];
				p2 = points[i + 1];
			}
			ctx.lineTo(p1.x, p1.y);
			ctx.stroke();
		} else if (touchPointIdList.length == 2) {
      var point1 = new LPoint(touchPointIdList[0].selfX,touchPointIdList[0].selfY);
      var point2 = new LPoint(touchPointIdList[1].selfX,touchPointIdList[1].selfY);
		  if(e.touchPointID == touchPointIdList[1].touchPointID){
        // 移动
        drawingLayer.stopDrag();
        drawingLayer.startDrag(touchPointIdList[1].touchPointID)

        // 缩放
        // 两指间距
        var scaleLenNew = distanceBetween(point1,point2);
        // 计算缩放比
        var scale = (scaleLenNew - scaleLenOld) / scaleLenOld;
        drawingLayer.scaleX = lastScale + scale;
        drawingLayer.scaleY = lastScale + scale;
        // backgroundLayer.scaleX = lastScale + scale;
        // backgroundLayer.scaleY = lastScale + scale;


      }

		}

	}


	function onMouseUp(e) {

		if(touchPointIdList.length == 1){
			// 单触点绘画
			isDrawing = false;
			points.length = 0;
		}
		// 手指up，数组清空
		for (var i = 0; i < touchPointIdList.length; i++) {
			if (touchPointIdList[i].touchPointID == e.touchPointID) {
				touchPointIdList.splice(i, 1);
				break;
			}
		}
		// ctx.clearRect(0,0,w,h)
	}

	function distanceBetween(point1, point2) {
		return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
	}

	function angleBetween(point1, point2) {
		return Math.atan2(point2.x - point1.x, point2.y - point1.y);
	}

	function midPointBtw(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}

	function initTouchPoint(e) {
		var flag = false;
		for (var i = 0; i < touchPointIdList.length; i++) {
			if (touchPointIdList[i].touchPointID == e.touchPointID) {
				touchPointIdList[i] = e;
				flag = true;
				break;
			}
		}
		if (!flag) {
			touchPointIdList.push(e);
		}
	}


	function initBackgroundLayer() {
		backgroundLayer = new LSprite();
		backgroundLayer.graphics.drawRect(0, '', [0, 0, w, h], true, '#4d4d4d');
		addChild(backgroundLayer);
	}


	$scope.$on('$ionicView.leave', function () {
		backgroundLayer.removeAllChild();
		backgroundLayer.removeAllEventListener()
	})


	$scope.goToIndex = function () {
		$state.go('index')
	}
})

.controller('DrawTrianglesCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var loader;
  var backgroundLayer;

  LInit(20, 'drawTriangles', w, h, main);


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

  LInit(20, 'image', w, h, main);

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

.
controller('MoveCtrl', function ($scope, $state) {
	var w = document.body.clientWidth;
	var h = document.body.clientHeight;
	var loader, backgroundLayer, layer, tempLocation;
	var touchPointIdList = [];
	var lenOld;
	var lastScale,lastRotate;
	var midPoint;
	var bitmap;
	// 初始的角度
	var startAngle;

	LInit(requestAnimationFrame, 'move', w, h, main);

	function main(event) {
		LMultitouch.inputMode = LMultitouchInputMode.TOUCH_POINT;
		initBackgroundLayer();
		loader = new LLoader();
		loader.addEventListener(LEvent.COMPLETE, loadBitmapdata);
		loader.load('img/adam.jpg', 'bitmapData');


	}


	function initBackgroundLayer() {
		backgroundLayer = new LSprite();
		backgroundLayer.graphics.drawRect(0, '', [0, 0, w, h], true, '#fff');
		addChild(backgroundLayer);

		// mouse_down
		backgroundLayer.addEventListener(LMouseEvent.MOUSE_DOWN, function (event) {
			lastScale = layer.scaleX;
			lastRotate = layer.rotate;
			var flag = false;
			for (var i = 0; i < touchPointIdList.length; i++) {
				if (touchPointIdList[i].touchPointID == event.touchPointID) {
					flag = true;
					break;
				}
			}
			if (!flag) {
				touchPointIdList.push(event);
			}

			// 第二个点的坐标
			if (touchPointIdList.length == 2) {
				var point1 = new LPoint(touchPointIdList[0].selfX,touchPointIdList[0].selfY);
				var point2 = new LPoint(touchPointIdList[1].selfX,touchPointIdList[1].selfY);

				lenOld = distanceBetween(point1, point2);

				startAngle = angleBetween(point1,point2);

				// var tempMatrix = new LMatrix();
				// tempMatrix.translate(-midPoint.x,-midPoint.y);
				// layer.transform.matrix = tempMatrix;
				// console.log(layer)
			}else if(touchPointIdList.length == 3){
				// 三指恢复原始状态
				layer.x = bitmap.getWidth()/2;
				layer.y = bitmap.getHeight()/2;
				layer.scaleX = layer.scaleY = 1;
				layer.rotate = 0;
			}
		});

		// mouse_move
		backgroundLayer.addEventListener(LMouseEvent.MOUSE_MOVE, function (event) {

			// 只有两个触点才移动
			if (touchPointIdList.length == 2) {
				var flag = false;
				for (var i = 0; i < touchPointIdList.length; i++) {
					if (touchPointIdList[i].touchPointID == event.touchPointID) {
						touchPointIdList[i] = event;
						flag = true;
						break;
					}
				}
				var point1 = new LPoint(touchPointIdList[0].selfX,touchPointIdList[0].selfY);
				var point2 = new LPoint(touchPointIdList[1].selfX,touchPointIdList[1].selfY);

				if (event.touchPointID == touchPointIdList[1].touchPointID) {

					// 移动
					layer.stopDrag();
					layer.startDrag(touchPointIdList[1].touchPointID);
					midPoint = midPointBtw(point1,point2);

					// 缩放
					var lenNew = distanceBetween(point1, point2);
					var scale = (lenNew - lenOld) / lenOld;
					// 最小是原大小
					layer.scaleX = lastScale + scale;
					layer.scaleY = lastScale + scale;
					// 旋转
					// 计算旋转角度
					var angle = angleBetween(point1,point2);
					var angleChange = (angle - startAngle)*180;
					console.log(angleChange)
					if(Math.abs(angleChange)<10){
						layer.rotate -= angleChange;
					}
					startAngle = angle;

				}
			}
		})
		backgroundLayer.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
			for (var i = 0; i < touchPointIdList.length; i++) {
				if (touchPointIdList[i].touchPointID == e.touchPointID) {
					touchPointIdList.splice(i, 1);
					break;
				}
			}
		})
	}

	function distanceBetween(point1, point2) {
		return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
	}

	function angleBetween(point1, point2) {
		return Math.atan2(point2.x - point1.x, point2.y - point1.y);
	}

	function midPointBtw(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}

	function loadBitmapdata(event) {
		var bitmapdata = new LBitmapData(loader.content);
		bitmap = new LBitmap(bitmapdata);

		layer = new LSprite();
		backgroundLayer.addChild(layer);
		layer.addChild(bitmap);

		bitmap.scaleX = w / bitmap.width;
		bitmap.scaleY = w / bitmap.width;

		layer.x = bitmap.getWidth()/2;
		layer.y = bitmap.getHeight()/2;

		bitmap.x = -bitmap.getWidth()/2;
		bitmap.y = -bitmap.getHeight()/2;
		// bitmap.x = -w/2;
		// bitmap.y = -w/2;

		// layer.x = w+w/2;
		// layer.y = w+w/2;
		// 控制是否绕着中心旋转，默认是true，绕着中心旋转，false是绕着
		// bitmap.rotateCenter = false;
		// bitmap.x += w/2;
		// bitmap.y += w/2;
		// layer.rotate = 45;
		// bitmap.rotate = 45;
		// bitmap.x += w/2;
		// bitmap.y += w/2;
		layer.alpha = 0.4;
	}

	/**
	 * 可以使用div控制canvas中的对象，div是在canvas之上显示的，这样布局就方便多了，可以充分发挥canvas和css的特长
	 */
	$scope.hideImage = function () {
		layer.visible = !layer.visible;
	}

	$scope.$on('$ionicView.leave', function () {
		backgroundLayer.removeAllChild();
		backgroundLayer.removeAllEventListener();

	})

	$scope.goToIndex = function () {
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
        LInit(20, $scope.list[this.activeIndex].id, w, h, main);
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
