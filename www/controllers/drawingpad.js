.controller('DrawingpadCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var backgroundLayer,drawing;
  var isDrawing;
  var points = [];
  var bitmap1;
  var bitmapdata1;
  var ctx;


  LInit(20, 'drawingpad', w, h, main);


  function main(event) {
    initBackgroundLayer();
    bitmapdata1 = new LBitmapData(null,0,0,w,h,LBitmapData.DATA_CANVAS);
    ctx = bitmapdata1._canvas.getContext('2d');
    bitmap1 = new LBitmap(bitmapdata1);

    backgroundLayer.addChild(bitmap1);

    backgroundLayer.addEventListener(LMouseEvent.MOUSE_DOWN,onMouseDown);
    backgroundLayer.addEventListener(LMouseEvent.MOUSE_MOVE,onMouseMove);
    backgroundLayer.addEventListener(LMouseEvent.MOUSE_UP,onMouseUp);
  }

  function onMouseDown(e) {
    isDrawing = true;
    points.push({x:e.selfX,y:e.selfY});
  }

  function onMouseMove(e) {
    if(!isDrawing) return;
    points.push({x:e.selfX,y:e.selfY});
    ctx.beginPath();
    ctx.moveTo(points[0].x,points[0].y);
    for (var i=1;i<points.length;i++){
      ctx.lineTo(points[i].x,points[i].y);
    }
    ctx.stroke();

  }


  function onMouseUp() {
    isDrawing = false;
    points.length = 0;
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
