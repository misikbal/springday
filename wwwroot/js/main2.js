document.addEventListener("DOMContentLoaded", function(){
	window.addEventListener('scroll', function() {
		
		
		
			if (window.scrollY > 400) {
				document.getElementById('navbar_top').classList.add('fixed-top');
				document.getElementById('navbar_top').classList.remove('padding-top');


				// add padding top to show content behind navbar
				navbar_height = document.querySelector('.navbar').offsetHeight;
				document.body.style.paddingTop = navbar_height + 'px';
			} else {
				document.getElementById('navbar_top').classList.remove('fixed-top');

				document.body.style.paddingTop = '0';
			
			} 
		
		
	});
	if(window.location.pathname !== '/' )
		{
				document.getElementById('navbar_top').classList.add('fixed-top');
				document.getElementById('navbar_top').classList.add('padding-top');


		document.getElementById('sticky-wrapper').classList.add('sticky-wrapper');
		document.getElementById('sticky-wrapper').classList.add('is-sticky');
		document.getElementById('sticky-top').classList.add('sticky-wrapper');

		document.getElementById('sticky-top').classList.add('is-sticky');

		}
	window.addEventListener('scroll', function() {
		
		if(window.location.pathname == '/' )
		{
		
			if (window.scrollY > 400) {
				document.getElementById('navbar_top').classList.add('fixed-top');
				document.getElementById('navbar_top').classList.remove('padding-top');

				document.getElementById('sticky-wrapper').classList.add('sticky-wrapper');
		        document.getElementById('sticky-wrapper').classList.add('is-sticky');

				// add padding top to show content behind navbar
				navbar_height = document.querySelector('.navbar').offsetHeight;
				document.body.style.paddingTop = navbar_height + 'px';
			} else {
					document.getElementById('navbar_top').classList.remove('fixed-top');
					document.getElementById('navbar_top').classList.remove('padding-top');

                    document.getElementById('sticky-wrapper').classList.remove('sticky-wrapper');
		            document.getElementById('sticky-wrapper').classList.remove('is-sticky');
					
					// remove padding top from body
				document.body.style.paddingTop = '0';
			
			} 
	}
		
	});
}); 

const themeSwitch = document.querySelector('input');

themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme');
});
(function($) { "use strict";

$(function() {
    var header = $(".start-style");
    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();
    
        if (scroll >= 10) {
            header.removeClass('start-style').addClass("scroll-on");
    } else {
            header.removeClass("scroll-on").addClass('start-style');
        }
    });
});		
    
//Animation

$(document).ready(function() {
    $('body.hero-anime').removeClass('hero-anime');
});

//Menu On Hover
    
$('body').on('mouseenter mouseleave','.nav-item',function(e){
        if ($(window).width() > 750) {
            var _d=$(e.target).closest('.nav-item');_d.addClass('show');
            setTimeout(function(){
            _d[_d.is(':hover')?'addClass':'removeClass']('show');
            },10);
        }
});	

//Switch light/dark
$(document).ready(function($) {
	var mode = localStorage.getItem('mode');
		if (mode) 
			$('body').addClass(mode);
	$(".switch").on('click', function () {
		
		if ($("body").hasClass("dark")) {
			
			$("body").removeClass("dark");
			localStorage.setItem('mode', null);	
			$(".switch").removeClass("switched");

		}
		else {
			$("body").addClass("dark");
			localStorage.setItem('mode', 'dark');
			$(".switch").addClass("switched");

		}

    });
});  

})(jQuery); 
$(document).ready(function(){
$('#itemslider').carousel({ interval: 3000 });

$('.carousel-showmanymoveone .item').each(function(){
var itemToClone = $(this);

for (var i=1;i<6;i++) {
itemToClone = itemToClone.next();

if (!itemToClone.length) {
itemToClone = $(this).siblings(':first');
}

itemToClone.children(':first-child').clone()
.addClass("cloneditem-"+(i))
.appendTo($(this));
}
});
});