const links = document.getElementsByTagName("link")

const scripts = document.getElementsByTagName("script")
$(document).ready(function(){
	$(window).scroll(function(){
      $('.deneme').each(function(){
					if( $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) )
          {          		   
              $(this).attr('src', $(this).attr('data-src')).removeAttr('data-src');
          }
			});


  })
})

$(document).ready(function(){
	$(window).scroll(function(){

    $(links).each(function(){
      if( $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) )
      {          		   
          $(this).attr('href', $(this).attr('data-href')).removeAttr('data-href');
      }
    });
  })
})

$(document).ready(function(){
	$(window).scroll(function(){
    $(scripts).each(function(){
    if( $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) )
    {          		   
        $(this).attr('src', $(this).attr('data-src')).removeAttr('data-src');
    }
  });
  });
});
