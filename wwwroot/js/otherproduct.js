$(function() {

	if ( $('.owl-1').length > 0 ) {
        $('.owl-1').owlCarousel({
            center: true,
            items:2,
            loop: true,
            stagePadding: 0,
            margin: 20,
            smartSpeed: 200,
            autoplay: true,
            nav: true,
            dots: true,
            pauseOnHover: true,
            responsive:{
                700:{
                    margin: 20,
                    nav: true,
                  items: 3
                },
                1000:{
                    margin: 20,
                    stagePadding: 0,
                    nav: true,
                  items: 4
                }
            }
        });            
    }

})