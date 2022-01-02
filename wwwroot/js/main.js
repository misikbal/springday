document.addEventListener("DOMContentLoaded", function(){
	document.querySelectorAll('.navbar .dropdown').forEach(function(everydropdown){
	  everydropdown.addEventListener('shown.bs.dropdown', function () {
			var delayInMilliseconds = 1000; //1 second

			setTimeout(function() {
			//your code to be executed after 1 second
			}, delayInMilliseconds);
		  el_overlay = document.createElement('span');
		  el_overlay.className = 'screen-darken';
		  document.body.appendChild(el_overlay)
	  });
  
	  everydropdown.addEventListener('hide.bs.dropdown', function () {
		var delayInMilliseconds = 1000; //1 second

		setTimeout(function() {
		  //your code to be executed after 1 second
		}, delayInMilliseconds);
		document.body.removeChild(document.querySelector('.screen-darken'));
		
	  });
	});
  
  }); 