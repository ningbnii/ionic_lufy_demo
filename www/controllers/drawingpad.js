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
    // drawingCircle();
    backgroundLayer.addChild(drawing);
    drawing.graphics.drawRect(0,'#fff',[0,0,w,h]);
    drawing.addEventListener(LMouseEvent.MOUSE_DOWN,onMouseDown);
    drawing.addEventListener(LMouseEvent.MOUSE_MOVE,onMouseMove);
    drawing.addEventListener(LMouseEvent.MOUSE_UP,onMouseUp);
  }

  function onMouseDown(e) {
    isDrawing = true;
    points.push({x:e.selfX,y:e.selfY});
  }

  function onMouseMove(e) {
    if(!isDrawing) return;
    points.push({x:e.selfX,y:e.selfY});

    drawing.graphics.add(function (ctx) {
      if(points.length){

        ctx.beginPath();
        ctx.moveTo(points[0].x,points[0].y);
        for (var i=1;i<points.length;i++){
          ctx.lineTo(points[i].x,points[i].y);
        }
        ctx.stroke();
      }
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
