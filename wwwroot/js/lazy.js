$(document).ready(function(){
	$(window).scroll(function(){
  		$('.deneme').each(function(){
					if( $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) )
          {          		   
              $(this).attr('src', $(this).attr('data-src')).removeClass("w-50").removeAttr('data-src');
          }
			});
  })
})
