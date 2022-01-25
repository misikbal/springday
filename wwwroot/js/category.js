
$(function() {
	if ( $('.owl-2').length > 0 ) {
        $('.owl-2').slick({
          centerMode: true,
        centerPadding: '60px',
        slidesToShow: 5,
        autoplay: true,
        arrows: false,
        autoplaySpeed: 500,
        responsive: [
          {
            breakpoint: 980,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 4
            }
          },
          {
            breakpoint: 780,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 2
            }
          },
          
        ]
        });            
    }

    if ( $('.owl-3').length > 0 ) {
      $('.owl-3').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        autoplay: true,
        arrows: false,
        autoplaySpeed: 500,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '100px',
              slidesToShow: 2
            }
          },
          {
            breakpoint: 980,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '5px',
              slidesToShow: 1
            }
          },
          
        ]
      });            
    }

})