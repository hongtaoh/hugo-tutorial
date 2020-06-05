;(function ($, window, document, undefined ) {

    'use strict';

    $(document).ready(function() {
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        $('.slider-images .slide').addClass('visually-hidden');

        function HomeBanner($el, id) {

            IU.debug('Module: Home Banner - ' + id);

            var $imageSliderContainer = $('.slider-images'),
                $degreeSliderContainer = $('.slider-degrees'),
                totalSlides = $('.slider-degrees').find('.slide').length,
                initDegreeSlideVal = getRandomInt(totalSlides),

                imageSliderOptions = {
                    arrows: false,
                    imageSliderInit: true,
                    initialSlide: -100,
                    fade: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 1500,
                    onInit: function(slick) {
                        if ($(window).width() > 1024) {
                            var thisImageIdx = $degreeSliderContainer.find('.slick-slide[index="' + initDegreeSlideVal + '"]').attr('data-image-match-idx');
                            slick.currentSlide = thisImageIdx;
                            $('.slider-images .slide').removeClass('visually-hidden');
                        }
                    }
                },

                degreeSliderOptions = {
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 2500,
                    centerMode: true,
                    draggable: false,
                    infinite: true,
                    initialSlide: initDegreeSlideVal,
                    focusOnSelect: true,
                    pauseOnHover: false,
                    slidesToShow: 10,
                    slidesToScroll: 1,
                    swipe: false,
                    vertical: true,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                arrows: true
                            }
                        }
                    ],
                    onInit: function(slick) {
                        $('.home-banner').attr('aria-hidden', true);

                        $('.slick-list').attr('tabindex', -1);
                        $('.slick-slide').find('a').attr({
                            'aria-hidden': true,
                            'tabindex': -1
                        });

                        $('.home-banner-sr').attr('aria-hidden', false);

                        var $currentSlide = $('.slick-active.slick-center:not(.slick-cloned)');
                        $currentSlide.find('a').attr('tabindex', 0);

                        $('.slide a').each(function() {
                            if ($(this).html().length > 25) {
                                $(this).parents('.slick-slide').addClass('long-degree-name');
                            } else {
                                $(this).parents('.slick-slide').addClass('short-degree-name');
                            }
                        });
                    },
                    onBeforeChange: function(slick) {
                        $('.slick-slide').find('a').attr('tabindex', -1);

                        if ($(window).width() > 1024) {
                            if (slick.currentDirection === 0) {
                                var thisImageIdx = $(slick.$slides.get(slick.currentSlide + 1)).data('image-match-idx');
                            } else if (slick.currentDirection === 1) {
                                var thisImageIdx = $(slick.$slides.get(slick.currentSlide - 1)).data('image-match-idx');
                            }
                            $imageSliderContainer.slickGoTo(thisImageIdx);
                        }
                    },
                    onAfterChange: function(slick) {
                        setTimeout(function() {
                            calculateMargins();
                        }, 500);

                        clickInteractionVsNavigate();

                        var $currentSlide = $(slick.$slides.get(slick.currentSlide));
                        $currentSlide.find('a').attr('tabindex', 0);
                    }
                }

            function calculateMargins() {
                var $homeBanner = $('.home-banner'),
                    $activeSlide = $('.slick-active.slick-center:not(.slick-cloned)'),
                    $bannerTagline = $('.banner-tagline');

                $homeBanner.removeClass('two-line-degree three-line-degree one-line-tagline two-line-tagline');
            }

            function mouseVerticalSwipe() {
                var dragging = false,
                    lastPosition = {},
                    dragDirection;

                $('.home-banner').on('mousedown', function() {
                    dragging = false;
                    dragDirection = '';

                    clearTimeout(this.downTimer);
                    this.downTimer = setTimeout(function() {
                        dragging = true;
                    }, 100);
                });

                $('.home-banner').on('mouseup', function() {
                    dragging = false;
                    clearTimeout(this.downTimer);

                    if (dragDirection == 'up') {
                        $degreeSliderContainer.slickNext();
                    } else if (dragDirection == 'down') {
                        $degreeSliderContainer.slickPrev();
                    }
                });

                $('.home-banner').on('mousemove', function() {
                    if (dragging == false) return;

                    if (typeof(lastPosition.x) != 'undefined') {
                        var deltaX = lastPosition.x - event.offsetX,
                            deltaY = lastPosition.y - event.offsetY;
                        if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {

                            dragDirection = 'up';

                        } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {

                            dragDirection = 'down';

                        }
                    }
                    lastPosition = {
                        x : event.offsetX,
                        y : event.offsetY
                    };
                })
            }

            function clickInteractionVsNavigate() {
                $('.home-banner .slick-active:not(.slick-center) a').each(function() {
                    var $this = $(this);
                    $this.attr({
                        "data-href": $this.attr('href')
                    }).removeAttr('href');
                });

                $('.home-banner .slick-active.slick-center a').each(function() {
                    var $this = $(this);
                    $this.attr({
                        "href": $this.attr('data-href')
                    }).removeAttr('data-href');
                });
            }

            function playPauseControls() {
                var bannerState = 'playing',
                    playPauseBtn = '<button class="play-pause"><span class="icon"></span><span class="icon-label">Pause Animation</span></button>',
                    playControls = $('<div class="play-controls via-js" aria-hidden="true"><div class="row pad">' + playPauseBtn + '</div></div>');

                $(playControls).insertAfter($('.banner-tagline'));

                $("button", playControls).on("click", function(event) {
                    event.preventDefault();

                    var $this = $(this);

                    if (bannerState === 'playing') {

                        $degreeSliderContainer.slickPause();
                        $this.html('<span class="icon"></span><span class="icon-label">Play Animation</span>').removeClass('playing').addClass('paused');
                        bannerState = 'paused';
                        return;
                    }

                    if (bannerState === 'paused') {
                        $degreeSliderContainer.slickPlay();
                        $this.html('<span class="icon"></span><span class="icon-label">Pause Animation</span>').removeClass('paused').addClass('playing');
                        bannerState = 'playing';
                        return;
                    }
                });

                function pauseSlideshow() {
                    $degreeSliderContainer.slickPause();
                    $("button", playControls).html('<span class="icon"></span><span class="icon-label">Play Animation</span>').removeClass('playing').addClass('paused');
                    bannerState = 'paused';
                }

                $('.home-banner').on('keyup click', 'a, .slick-next, .slick-prev', function(e) {
                    var keyCode = e.keyCode || e.which;

                    if (keyCode == 9) {
                        pauseSlideshow();
                    }

                    if ($(this).is('a, button') && !$(this).hasClass('slick-center')) {
                        pauseSlideshow();
                    }
                });
            }

            function keyboardNavigation() {
                var onSlide = false;

                $('.home-banner').on('keyup', '.slick-slide a', function(e) {
                    var keyCode = e.keyCode || e.which;

                    if (keyCode == 9 || keyCode == 16) {
                        onSlide = true;
                    } else if (keyCode == 37 && onSlide == true) {
                        e.preventDefault();
                        $degreeSliderContainer.slickPrev();

                        var currentSlideIdx = $degreeSliderContainer.slickCurrentSlide();
                        setTimeout(function() {
                            $degreeSliderContainer.find('.slick-slide[index=' + currentSlideIdx + '] a').focus();
                        }, 500);
                    } else if (keyCode == 39 && onSlide == true) {
                        e.preventDefault();
                        $degreeSliderContainer.slickNext();

                        var currentSlideIdx = $degreeSliderContainer.slickCurrentSlide();
                        setTimeout(function() {
                            $degreeSliderContainer.find('.slick-slide[index=' + currentSlideIdx + '] a').focus();
                        }, 500);
                    } else {
                        onSlide = false;
                    }
                });
            }

            enquire.register("(max-width: 1024px)", {

                match : function() {
                    $imageSliderContainer.unslick();
                },

                unmatch : function() {
                    $imageSliderContainer.slick(imageSliderOptions);

                    if (!$('.slide-degrees.slick-initialized')) {
                        $degreeSliderContainer.slick(degreeSliderOptions);
                    }
                },

                setup: function() {
                    $degreeSliderContainer.slick(degreeSliderOptions);
                    $imageSliderContainer.slick(imageSliderOptions);
                    mouseVerticalSwipe();
                    clickInteractionVsNavigate();
                    playPauseControls();
                    keyboardNavigation();
                }
            });
        }

        // Add Initialisation
        IU.addInitalisation('home-banner', function() {
            $('.home-banner').each(function(id) {

                var $this = $(this);

                // this element has already been initialized
                // and we're only initializing new modules
                if ($this.data('isHomeBanner')) {
                    return true;
                }

                // mark element as initialized
                $this.data('isHomeBanner', true);

                new HomeBanner($this, id);
            });
        });

        // Register UIModule
        IU.UIModule({
            module: 'home-banner',
            requireSlick: '.home-banner',
            init: function() {
                IU.initialize('home-banner');
            }
        });
    });
})( jQuery, window, window.document );