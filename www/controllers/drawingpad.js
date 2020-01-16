.
controller('DrawingpadCtrl', function ($scope, $state) {
	
	var w = document.body.clientWidth;
	var h = document.body.clientHeight;
	var backgroundLayer, drawing;
	var isDrawing, lastPoint;
	var points = [];
	var bitmap1;
	var bitmapdata1;
	var ctx;
	var lineWidth = 1;
	var touchPointIdList = []; // 触点数组
	
	
	LInit(20, 'drawingpad', w, h, main);
	
	
	function main(event) {
		LMultitouch.inputMode = LMultitouchInputMode.TOUCH_POINT;
		initBackgroundLayer();
		bitmapdata1 = new LBitmapData(null, 0, 0, w, h, LBitmapData.DATA_CANVAS);
		ctx = bitmapdata1._canvas.getContext('2d');
		ctx.lineJoin = ctx.lineCap = 'round';
		bitmap1 = new LBitmap(bitmapdata1);
		
		backgroundLayer.addChild(bitmap1);
		
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
			// 双指移动缩放
			
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
			// 移动
			backgroundLayer.stopDrag();
			backgroundLayer.startDrag(touchPointIdList[1].touchPointID)
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
		console.log(touchPointIdList.length)
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
		backgroundLayer.graphics.drawRect(0, '', [0, 0, w, h], true, '#fff');
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
