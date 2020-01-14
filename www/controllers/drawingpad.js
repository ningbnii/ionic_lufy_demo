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


  LInit(20, 'drawingpad', w, h, main);


  function main(event) {
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
    isDrawing = true;
    ctx.lineWidth = lineWidth;
    points.push({x:e.selfX,y:e.selfY});
  }

  function onMouseMove(e) {
    if (!isDrawing) return;
    points.push({x:e.selfX,y:e.selfY});
    ctx.clearRect(0,0,w,h);

    var p1 = points[0];
    var p2 = points[1];

    ctx.beginPath();
    ctx.moveTo(p1.x,p1.y);

    for(var i=0;i<points.length;i++){
      var midPoint = midPointBtw(p1,p2);
      ctx.quadraticCurveTo(p1.x,p1.y,midPoint.x,midPoint.y);
      p1 = points[i];
      p2 = points[i+1];
    }
    ctx.lineTo(p1.x,p1.y);
    ctx.stroke();

  }


  function onMouseUp() {
    isDrawing = false;
    points.length = 0;
    // ctx.clearRect(0,0,w,h)
  }

  function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  function angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  }

  function midPointBtw(p1,p2){
    return {
      x:p1.x+(p2.x-p1.x)/2,
      y:p1.y+(p2.y-p1.y)/2
    };
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
