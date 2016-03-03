Template.home.rendered = function() {
	if ($(window).scrollTop() > 150) $('.navbar').addClass('solid');
    $(window).scroll(function() {
        if( $(window).scrollTop() > 150) {
            $('.navbar').addClass('solid');
        } else { 
        	$('.navbar').removeClass('solid');
        }
    });    
};