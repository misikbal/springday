

$(function() {

	if ( $('.owl-2').length > 0 ) {
        $('.owl-2').owlCarousel({
            center: true,
            items:3,
            loop: true,
            stagePadding: 0,
            margin: 20,
            smartSpeed: 800,
            autoplay: true,
            nav: true,
            dots: false,
            pauseOnHover: false,
            responsive:{
                700:{
                    margin: 20,
                    nav: true,
                  items: 4
                },
                1000:{
                    margin: 20,
                    stagePadding: 0,
                    nav: true,
                  items: 6
                }
            }
        });            
    }

    if ( $('.owl-3').length > 0 ) {
        $('.owl-3').owlCarousel({
            center: true,
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