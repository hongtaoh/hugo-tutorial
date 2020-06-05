// LIGHTBOX SCRIPTS //
var $ = jQuery;
jQuery(function(){
	$.fn.nextInDOM = function(selector) {
		// NOTE: if multiple elements specified, only the first is considered
		var element = this;
		if(this.length > 1) element = this.first();
		return nextInDOM(selector?selector:'*', element, $('*').length, $('*').last());
	};
	
	$.fn.prevInDOM = function(selector) {
		// NOTE: if multiple elements specified, only the first is considered
		var element = this;
		if(this.length > 1) element = this.first();
		return prevInDOM(selector?selector:'*', element, $('*').length, $('*').first());
	};
	
	// next in dom implementation
	function nextInDOM(_selector, _subject, _maxNodes, _lastNode) {
		var nid = $(), next = getNext(_subject, _lastNode), iters = 1;
		$('html, body').addClass('cSeen');
	    while(next.length != 0) {
			if(iters > _maxNodes) return $();
			if(next.is(_selector)) {
				nid = next;
				break;
			}
	        next = getNext(next, _lastNode);
			iters++;
	    }
	    $('.cSeen').removeClass('cSeen');
	    return nid;
	}
	
	function getNext(_subject, _lastNode) {
		if(_subject[0] == _lastNode[0]) return $();
		if(!(_subject.hasClass('cSeen')) && _subject.children().length > 0) return _subject.children().first();
		else if(_subject.next().length > 0) return _subject.next();
		else if (_subject.parent().length > 0) {
			_subject.parent().addClass('cSeen');
			return getNext(_subject.parent(), _lastNode);
		}
	    return $();
	}
	
	// prev in dom implementation
	function prevInDOM(_selector, _subject, _maxNodes, _firstNode) {
	    var prev = getPrev(_subject, _firstNode), iters = 1;
		while(prev.length != 0) {
			if(iters > _maxNodes) return $();
	    	if(prev.is(_selector)) return prev;
	    	prev = getPrev(prev, _firstNode);
			iters++;
	    }
	    return $();
	}

	function getPrev(_subject, _firstNode) {
		if(_subject[0] == _firstNode[0]) return $();
	    if(_subject.prev().length > 0 && _subject.prev().children().length > 0) {
			var p = _subject.prev().children().last();
			while(p.children().length > 0) p = p.children().last();
			return p;
		}
		else if(_subject.prev().length > 0) {
			return _subject.prev();
		}
		else if(_subject.parent().length > 0) {
			return _subject.parent();
		}
		return $();
	}

	jQuery('a img').click(function(){
		var caption;
		var thumb = jQuery(this);
		var link = jQuery(this).parent('a').attr('href');
		var prev_thumb = jQuery(thumb).prevInDOM('a[href$=".gif"] img, a[href$=".jpg"] img, a[href$=".jpeg"] img, a[href$=".png"] img');
		var prev_link = jQuery(prev_thumb).parent('a').attr('href');
		if(!prev_link){
			jQuery('#lightbox_container .prev').hide();
		} else {
			jQuery('#lightbox_container .prev').show();
		}
		var next_thumb = jQuery(thumb).nextInDOM('a[href$=".gif"] img, a[href$=".jpg"] img, a[href$=".jpeg"] img, a[href$=".png"] img');
		var next_link = jQuery(next_thumb).parent('a').attr('href');
		if(!next_link){
			jQuery('#lightbox_container .next').hide();
		} else {
			jQuery('#lightbox_container .next').show();
		}
		var figcaption = jQuery(this).parent('a').parent('figure').find('figcaption').html();
		var gallery_caption = jQuery(this).parent('a').parent('.tiled-gallery-item').find('.tiled-gallery-caption').html();
		if(figcaption){
			caption = figcaption;
		} else if(gallery_caption){
			caption = gallery_caption;
		} else {
			caption = null;
		}
		if((link).indexOf('.jpg') > 0 || (link).indexOf('.jpeg') > 0 || (link).indexOf('.gif') > 0 || (link).indexOf('.png') > 0){
			jQuery(thumb).addClass('active_thumb');
			if(!caption){
				jQuery('.the_lightbox').html('<div><img class="lightbox_img" src="' + link + '"></div>');
			} else {
				jQuery('.the_lightbox').html('<div><img class="lightbox_img" src="' + link + '"><div class="caption">' + caption + '</div></div>');
			}
			jQuery('#lightbox_container').fadeIn(250, function(){
				if(caption){
					var image_height = jQuery('.the_lightbox').find('img').height();
					var window_height = jQuery(window).height();
					var caption_y = ((window_height - image_height)*0.5) + image_height + 14;
					var image_width = jQuery('.the_lightbox').find('img').width();
					var window_width = jQuery(window).width();
					var caption_x = (window_width - image_width)*0.5;
					jQuery('.caption').css('top', caption_y).css('left',caption_x).css('width', image_width).fadeIn(250);
				}
			});
			return false;
		} else {

		}
	});
	jQuery('.close').click(function(){
		jQuery('#lightbox_container').fadeOut(500, function(){
			jQuery('.the_lightbox').html('');
		});
		jQuery('.caption').fadeOut(500);
		jQuery('img.active_thumb').removeClass('active_thumb');
	});
	jQuery(document).keyup(function(e){
		if(e.keyCode === 27){
			jQuery('.close').trigger('click');
		}
	});
	jQuery('#lightbox_container').click(function(e) {                    
	   	if((!jQuery(e.target).hasClass('lightbox_img')) && (!jQuery(e.target).hasClass('next')) && (!jQuery(e.target).hasClass('prev')) && (!jQuery(e.target).hasClass('arrow')) )
	   	{
	       	jQuery('#lightbox_container').fadeOut(500, function(){
				jQuery('.the_lightbox').html('');
			});
			jQuery('.caption').fadeOut(500);    
			jQuery('img.active_thumb').removeClass('active_thumb');      
	   	}
	});
	jQuery('#lightbox_container .next').click(function(){
		var active_thumb = jQuery('img.active_thumb');
		var next_thumb = jQuery(active_thumb).nextInDOM('a[href$=".gif"] img, a[href$=".jpg"] img, a[href$=".jpeg"] img, a[href$=".png"] img');
		var link = jQuery(next_thumb).parent('a').attr('href');
		if(link){
			var caption;
			var figcaption = jQuery(next_thumb).parent('a').parent('figure').find('figcaption').html();
			var gallery_caption = jQuery(next_thumb).parent('a').parent('.tiled-gallery-item').find('.tiled-gallery-caption').html();
			if(figcaption){
				caption = figcaption;
			} else if(gallery_caption){
				caption = gallery_caption;
			} else {
				caption = null;
			}
			jQuery(active_thumb).removeClass('active_thumb');
			jQuery(next_thumb).addClass('active_thumb');
			jQuery('.the_lightbox').fadeOut(250, function(){
				if(!caption){
					jQuery('.the_lightbox').html('<div><img class="lightbox_img" src="' + link + '"></div>');
				} else {
					jQuery('.the_lightbox').html('<div><img class="lightbox_img" src="' + link + '"><div class="caption" style="display:none;">' + caption + '</div></div>');
				}
				if(jQuery(next_thumb).prevInDOM('a[href$=".gif"] img, a[href$=".jpg"] img, a[href$=".jpeg"] img, a[href$=".png"] img').parent('a').attr('href')){
					jQuery('#lightbox_container .prev').fadeIn(250);
				} else {
					jQuery('#lightbox_container .prev').fadeOut(250);
				}
				if(jQuery(next_thumb).nextInDOM('a[href$=".gif"] img, a[href$=".jpg"] img, a[href$=".jpeg"] img, a[href$=".png"] img').parent('a').attr('href')){
					jQuery('#lightbox_container .next').fadeIn(250);
				} else {
					jQuery('#lightbox_container .next').fadeOut(250);
				}
				jQuery('.the_lightbox').fadeIn(250, function(){
					if(caption){
						var image_height = jQuery('.the_lightbox').find('img').height();
						var window_height = jQuery(window).height();
						var caption_y = ((window_height - image_height)*0.5) + image_height + 14;
						var image_width = jQuery('.the_lightbox').find('img').width();
						var window_width = jQuery(window).width();
						var caption_x = (window_width - image_width)*0.5;
						jQuery('.caption').css('top', caption_y).css('left',caption_x).css('width', image_width).fadeIn(250);
					}
				});
			});
		}
	});
	jQuery('#lightbox_container .prev').click(function(){
		var active_thumb = jQuery('img.active_thumb');
		var prev_thumb = jQuery(active_thumb).prevInDOM('a[href$=".gif"] img, a[href$=".jpg"] img, a[href$=".jpeg"] img, a[href$=".png"] img');
		var link = jQuery(prev_thumb).parent('a').attr('href');
		if(link){
			var caption;
			var figcaption = jQuery(prev_thumb).parent('a').parent('figure').find('figcaption').html();
			var gallery_caption = jQuery(prev_thumb).parent('a').parent('.tiled-gallery-item').find('.tiled-gallery-caption').html();
			if(figcaption){
				caption = figcaption;
			} else if(gallery_caption){
				caption = gallery_caption;
			} else {
				caption = null;
			}
			jQuery(active_thumb).removeClass('active_thumb');
			jQuery(prev_thumb).addClass('active_thumb');
			jQuery('.the_lightbox').fadeOut(250, function(){
				if(!caption){
					jQuery('.the_lightbox').html('<div><img class="lightbox_img" src="' + link + '"></div>');
				} else {
					jQuery('.the_lightbox').html('<div><img class="lightbox_img" src="' + link + '"><div class="caption" style="display:none;">' + caption + '</div></div>');
				}
				if(jQuery(prev_thumb).prevInDOM('a[href$=".gif"] img, a[href$=".jpg"] img, a[href$=".jpeg"] img, a[href$=".png"] img').parent('a').attr('href')){
					jQuery('#lightbox_container .prev').fadeIn(250);
				} else {
					jQuery('#lightbox_container .prev').fadeOut(250);
				}
				if(jQuery(prev_thumb).nextInDOM('a[href$=".gif"] img, a[href$=".jpg"] img, a[href$=".jpeg"] img, a[href$=".png"] img').parent('a').attr('href')){
					jQuery('#lightbox_container .next').fadeIn(250);
				} else {
					jQuery('#lightbox_container .next').fadeOut(250);
				}
				jQuery('.the_lightbox').fadeIn(250, function(){
					if(caption){
						var image_height = jQuery('.the_lightbox').find('img').height();
						var window_height = jQuery(window).height();
						var caption_y = ((window_height - image_height)*0.5) + image_height + 14;
						var image_width = jQuery('.the_lightbox').find('img').width();
						var window_width = jQuery(window).width();
						var caption_x = (window_width - image_width)*0.5;
						jQuery('.caption').css('top', caption_y).css('left',caption_x).css('width', image_width).fadeIn(250);
					}
				});
			});
		}
	});
});
jQuery(window).resize(function() {
	var caption = jQuery('.the_lightbox').find('.caption');
	if(caption){
		var image_height = jQuery('.the_lightbox').find('img').height();
		var window_height = jQuery(window).height();
		var caption_y = ((window_height - image_height)*0.5) + image_height + 14;
		var image_width = jQuery('.the_lightbox').find('img').width();
		var window_width = jQuery(window).width();
		var caption_x = (window_width - image_width)*0.5;
		jQuery('.caption').css('top', caption_y).css('left',caption_x).css('width', image_width);
	}
});