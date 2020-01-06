.controller('DrawingpadCtrl', function($scope, $state) {

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  var backgroundLayer,drawing;
  var isDrawing;
  var points = [];


  LInit(20, 'drawingpad', w, h, main);


  function main(event) {
    initBackgroundLayer();
    drawing = new LShape();

    backgroundLayer.addChild(drawing);
    drawing.graphics.drawRect(0,'#fff',[0,0,w,h]);
    drawing.addEventListener(LMouseEvent.MOUSE_DOWN,onMouseDown);
    drawing.addEventListener(LMouseEvent.MOUSE_MOVE,onMouseMove);
    drawing.addEventListener(LMouseEvent.MOUSE_UP,onMouseUp);
  }

  function onMouseDown(e) {
    isDrawing = true;

    drawing.graphics.add(function(ctx){
      ctx.lineWidth = 5;
      ctx.lineJoin = ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgb(0,0,0)';
      points.push({x:e.selfX,y:e.selfY});
      // ctx.moveTo(e.selfX,e.selfY);
    });
    // drawing.graphics.beginPath();
    // drawing.graphics.lineWidth(10);
    // drawing.graphics.lineJoin('round');
    // drawing.graphics.lineCap('round');
    // // 虚化和阴影
    // drawing.graphics.
    // drawing.graphics.moveTo(e.selfX,e.selfY);
  }

  function onMouseMove(e) {
    if(!isDrawing) return;
    points.push({x:e.selfX,y:e.selfY});
    drawing.graphics.add(function (ctx) {
      // drawing.graphics.clear();
      ctx.beginPath();
      ctx.moveTo(points[0].x,points[0].y);
      console.log(1)
      for (var i=1;i<points.length;i++){
        ctx.lineTo(points[i].x,points[i].y);
      }
      ctx.stroke();
    })

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
