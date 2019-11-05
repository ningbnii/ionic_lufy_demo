.controller('SwiperCtrl', function($scope, $state) {
  var mySwiper = new Swiper('.swiper-container', {
    autoplay: false,//可选选项，自动滑动
    direction : 'vertical',
    observer:true,//修改swiper自己或子元素时，自动初始化swiper
    observeParents:true//修改swiper的父元素时，自动初始化swiper
  })

  $scope.list = [
    {
      id:'slider1',
      img:'img/adam.jpg',
    },
    {
      id:'slider2',
      img:'img/ben.png',
    },
    {
      id:'slider3',
      img:'img/mike.png',
    }
  ];
  console.log($scope.list)

  var w = document.body.clientWidth;
  var h = document.body.clientHeight;
  if(LGlobal.frameRate){
    // 切换页面，动画会越来越快，应该是在切换页面后，之前的计时器没有清除导致的
    clearInterval(LGlobal.frameRate)
  }

  LInit(50, 'slider1', w, h, main);

  var backgroundLayer;


  function main(event) {
    initBackgroundLayer();
    backgroundLayer.graphics.drawRect(0,'',[0,0,w,h],true,'rgba(0,0,0)');
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
