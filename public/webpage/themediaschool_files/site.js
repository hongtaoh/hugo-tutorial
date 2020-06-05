function myDateFunction(id) {
    var date = $("#" + id).data("date");
    var hasEvent = $("#" + id).data("hasEvent");
    if(hasEvent == true){
        $('#date').val(date);
        $('#calendar_submit').submit();
    }
}

function toggle(source) {
    checkboxes = document.getElementsByName('category');
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = source.checked;
    }
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function show_courses(clicked){
    var toc_item = $(clicked).text();
    $('.course-folder-name:contains("' + toc_item + '")').addClass('active');
    $('.course-folder-name.active').show();
    $('.course-folder-name.active').next('dl').find('dt').show();
    $('.filters').slideUp();
    $('#toc legend').text('Filter Courses by Category');
}
function hide_courses(clicked){
    var toc_item = $(clicked).text();
    $('.course-folder-name:contains("' + toc_item + '")').removeClass('active');
    var active_check = $('.course-folder-name.active').length;
    if(active_check){
        $('.course-folder-name.active').show();
        $('.course-folder-name.active').next('dl').find('dt').show();
    } else {
        $('.course-listings h3').show();
        $('.course-listings dt').show();
        $('.filters').slideDown();
        $('#toc legend').text('Or Filter Courses by Category');
        $('#course_filter').val('');
    }   
}

function show_faculty(){
    var active_terms = [];
    $('.applied_terms ul').html('');
    $('.research_terms dl .terms li.active').each(function(){
        var term_id = $(this).attr('term');
        var term_name = $(this).text();
        active_terms.push(term_id);
        $('.applied_terms ul').append('<li term="' + term_id + '"><span>' + term_name + '</span></li>');
    });
    $('article.profile').each(function(){
        $(this).removeClass('first middle last');
        for ( var i = 0; i < active_terms.length; i++ ){
            if ( $(this).hasClass( active_terms[i] ) ){
                $(this).show();
                break;  
            } else {
                $(this).hide();
            }
        }
    });

    if(active_terms === undefined || active_terms.length === 0){
        $('article.profile').show();
    }

    count=0;
    $('article.profile:visible').each(function(i,e){
        count=count+1;
        if(count==1){
            $(e).addClass('first');
        }
        if(count==2){
            $(e).addClass('middle');
        }
        if(count==3){
            $(e).addClass('last');
            count=0;
        }
    });
}

(function (window, document, $, undefined) {
    IU.addHelper('smoothScroll', function() {

        var scope = this;

        $('a[href*="#"]:not([href="#"], [href^="#panel"])').not('#skipnav a, a[id^="launch-quiz"]').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

                var offsetForNav = (IU.settings.bigNav) ? 68 : 55;

                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - offsetForNav // accounts for sticky nav or branding bar
                    }, 1000);

                    return false;
                }
            }
        });

        scope.debug('Helper: Smooth scroll [overridden]');
    });
})(window, window.document, jQuery);

(function (window, document, $, undefined) {
    $(document).ready(function() {
        
        Foundation.OffCanvas.defaults.transitionTime = 500;
        Foundation.OffCanvas.defaults.forceTop = false;
        Foundation.OffCanvas.defaults.positiong = 'right';

        //Foundation.Accordion.defaults.multiExpand = true;
        Foundation.Accordion.defaults.allowAllClosed = true;

        $(document).foundation();
        
        var IUSearch = window.IUSearch || {};
        var IU = window.IU || {};
        
        /* Initialize global branding */        
        IUSearch.init({
            CX: {
                site: '004156415053543418472:qvkubx72-_y', // Media School
                all: '016278320858612601979:w_w23ggyftu' // IU Bloomington
                //all: '016278320858612601979:pwcza8pis6k' // IUPUI
            },
            wrapClass: 'row pad',
            searchBoxIDs: ['search', 'off-canvas-search']
        });
        
        /* Delete modules if necessary (prevents them from auto-initializing) */
        // delete IU.uiModules['accordion'];

        /*
         * Initialize global IU & its modules
         * Custom settings can be passsed here
         */
        IU.init && IU.init({debug: true});

    });
})(window, window.document, jQuery);


(function( $ ){
    
    /* Rewrite machform urls */
    
    if($('#mf_placeholder').length){
        console.log('there is a machform');
        var the_content = document.getElementById("content").innerHTML;
        var res = the_content.replace(/indiana\.edu\/\~mediasch/g, "mediaschool.indiana.edu");
        document.getElementById("content").innerHTML = res;
    }

/********* Begin Custom Course Page (Alex Weiss Hills) */

    //*** KEYWORD FILTER COURSES ***//
    $(document).on('keyup','#course_filter',function(){
        var clean_search_term = $(this).val().toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace('  ', ' ').replace('  ', ' ');
        $('h3.course-folder-name').hide();
        $('.accordion-content').each(function(){
            var clean_course = $(this).html().toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace('  ', ' ').replace('  ', ' ');
            if(clean_course.indexOf(clean_search_term) >= 0){
                $(this).prev('dt').show();
                $(this).parent('dl').prev('h3.course-folder-name').show();
            } else {
                $(this).prev('dt').removeClass('is-active').attr('aria-expanded','false').hide();
                $(this).prev('dt').find('.accordion-title').attr('aria-expanded','false');
                $(this).attr('aria-hidden', 'true').hide();
            }
        });
    });

    //*** TOC FILTER COURSES ***//
    $('.column .item label').click(function(){
        $('.course-listings h3').hide();
        $('.course-listings dt.is-active').each(function(){
            $(this).next('dd').attr('aria-hidden','true').hide();
            $(this).find('.accordion-title').attr('aria-expanded','false');
            $(this).removeClass('is-active').attr('aria-expanded','false');
        });
        $('.course-listings dt').hide();
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            hide_courses(this);
        } else {
            $(this).addClass('active');
            show_courses(this);
        }
    });
    $(document).on('keyup','.column .item input',function(e){
        if(e.keyCode == 32){
            $(this).next('label').trigger('click');
        }
    });

/********* End Custom Course Page (Alex Weiss Hills) */

/********* Begin Custom People Directory (Alex Weiss Hills) */

    $('.research_terms dl .terms li').click(function(){
        $(this).toggleClass('active');
        show_faculty();
    });

    $('body').on('click', '.applied_terms li', function(){
        var term_id = $(this).attr('term');
        $('.research_terms dl .terms li[term="' + term_id + '"]').trigger('click');
    });

/********* End Custom People Directory (Alex Weiss Hills) */

/********* Begin Focus Script (Alex Weiss Hills) */
    if($('#focus-here').length){
        $('#focus-here').addClass('focused').focus();
    }

/********* End Focus Script (Alex Weiss Hills) */

})(jQuery);