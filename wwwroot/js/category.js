window.addEventListener('load', function () {
  [].forEach.call(document.querySelectorAll('.glider'), function (ele) {
      ele.addEventListener('glider-slide-visible', function (event) {
          var glider
              = Glider(this); 
      });
      new Glider(ele, {
        slidesToShow: 1,
        slidesToScroll: 1,
        scrollLock: true,
        draggable: true,
        duration: 0.5,
        dots: ele.parentNode.querySelector('.dots'),
        arrows: {
            prev: ele.parentNode.querySelector('.glider-prev'),
            next: ele.parentNode.querySelector('.glider-next')
        },
        responsive: [
          {
          breakpoint: 768,
          settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              duration: 0.5,
              arrows: {
              prev: ele.parentNode.querySelector('.glider-prev'),
              next: ele.parentNode.querySelector('.glider-next')
              },
              dots: ele.parentNode.querySelector('.dots'),
  
          }
          },
          {
          // If Screen Size More than 1024px
          breakpoint: 1024,
          settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              duration: 0.5,
              arrows: {
                prev: ele.parentNode.querySelector('.glider-prev'),
              next: ele.parentNode.querySelector('.glider-next')
              },
              dots: ele.parentNode.querySelector('.dots'),
  
          }
          }
      ]
    });
  });
  [].forEach.call(document.querySelectorAll('.ref'), function (ele) {
    ele.addEventListener('glider-slide-visible', function (event) {
        var glider
            = Glider(this); 
    });
    new Glider(ele, {
      slidesToShow: 3.5,
      slidesToScroll: 1,
      scrollLock: true,
      draggable: true,
      duration: 0.5,
      dots: ele.parentNode.querySelector('.dots'),
      arrows: {
          prev: ele.parentNode.querySelector('.glider-prev'),
          next: ele.parentNode.querySelector('.glider-next')
      },
      responsive: [
        {
        breakpoint: 768,
        settings: {
            slidesToShow: 4.5,
            slidesToScroll: 1,
            duration: 0.5,
            arrows: {
            prev: ele.parentNode.querySelector('.glider-prev'),
            next: ele.parentNode.querySelector('.glider-next')
            },
            dots: ele.parentNode.querySelector('.dots'),

        }
        },
        {
        // If Screen Size More than 1024px
        breakpoint: 1024,
        settings: {
            slidesToShow: 5.5,
            slidesToScroll: 1,
            duration: 0.5,
            arrows: {
              prev: ele.parentNode.querySelector('.glider-prev'),
            next: ele.parentNode.querySelector('.glider-next')
            },
            dots: ele.parentNode.querySelector('.dots'),

        }
        }
    ]
  });
});
});