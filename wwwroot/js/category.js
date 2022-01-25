
$(function() {
	// if ( $('.owl-2').length > 0 ) {
  //       $('.owl-2').owlCarousel({
  //           center: true,
  //           items:3,
  //           lazyLoad:true,
  //           responsiveClass:true,
  //           loop: true,
  //           stagePadding: 0,
  //           margin: 20,
  //           smartSpeed: 800,
  //           autoPlay: 750,
  //           nav: true,
  //           dots: false,
  //           pauseOnHover: false,
  //           responsive:{
  //               700:{
  //                   margin: 20,
  //                   nav: true,
  //                 items: 4
  //               },
  //               1000:{
  //                   margin: 20,
  //                   stagePadding: 0,
  //                   nav: true,
  //                 items: 6
  //               }
  //           }
  //       });            
  //   }

    if ( $('.owl-3').length > 0 ) {
      $('.owl-3').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        speed: 300,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
        // $('.owl-3').owlCarousel({
        //     center: true,
        //     items:1,
        //     loop: true,
        //     stagePadding: 0,
        //     margin: 20,
        //     smartSpeed: 600,
        //     autoPlay: 750,
        //     nav: true,
        //     dots: true,
        //     pauseOnHover: true,
        //     responsive:{
        //         700:{
        //             margin: 20,
        //             nav: true,
        //           items: 2
        //         },
        //         1000:{
        //             margin: 20,
        //             stagePadding: 0,
        //             nav: true,
        //           items: 3
        //         }
        //     }
        // });            
    }

})