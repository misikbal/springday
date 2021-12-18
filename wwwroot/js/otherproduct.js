$(function() {

	if ( $('.owl-2').length > 0 ) {
        $('.owl-2').owlCarousel({
            center: false,
            items:1,
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
                  items: 2
                },
                1000:{
                    margin: 20,
                    stagePadding: 0,
                    nav: true,
                  items: 3
                }
            }
        });            
    }

})