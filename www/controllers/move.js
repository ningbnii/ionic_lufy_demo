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
