function thumb_click(that){
	var thumb_id = $(that).attr('id');
	var image_id = thumb_id.replace('thumb','image');
	var index = '-' + $(that).index()*100 + '%';
	$(that).parent().parent().find('.images').animate({
		left: index
	}, 500);
	$('.single_image.active').removeClass('active');
	$('#' + image_id).addClass('active');
	$('.single_thumb.active').removeClass('active');
	$(that).addClass('active');
}

(function( $ ){
    
    // GALLERY FUNCTIONALITY //
	$('.single_thumb').click(function(){
		var that = $(this);
		thumb_click(that);
	});
	$('.single_thumb').keypress(function (e) {
	   var that = $(this);
	   var key = e.which;
	   if(key == 13){
	       thumb_click(that);
	   }
	});
	
	// LOAD VIDEO ON COVER CLICK //
	$('.video_cover.embeded').click(function(){
		$(this).css('visibility','hidden');
		$(this).next('.the_video').css('visibility','visible');
	});
	$('.video_cover.embeded').keypress(function (e) {
	   var that = $(this);
	   var key = e.which;
	   if(key == 13){
	       $(that).trigger('click');
	   }
	});
	
})(jQuery);