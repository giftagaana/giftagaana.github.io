'use strict';
var $ = jQuery.noConflict();



$(document).ready(function () {

    // Smooth Page Scroll
    // ---------------------------------------------------------------------------------------   
    $('.primary-navbar a[href^=#]').click(function (event) {
        event.preventDefault();
        if ((jQuery('body > main').hasClass('non-sticky'))) {
            $('html,body').animate({
                scrollTop: $(this.hash).offset().top}, 1000);
        }
        else {
            $('.primary-navbar li').removeClass('active');
            $(this).addClass('active');
            var header_height = $('.header-wrap').outerHeight();
            $('html,body').animate({
                scrollTop: $(this.hash).offset().top - header_height}, 1000);
        }

    });
    // Sticky Header
    // ---------------------------------------------------------------------------------------
    $(window).scroll(function () {
        if (!(jQuery('body > main').hasClass('non-sticky'))) {
            if ((jQuery('body  section  div').hasClass('banner-wrap')))
            {
                var banner_height = $('#main-slider').outerHeight();
                if (jQuery(window).scrollTop() > banner_height) {
                    jQuery(".header-wrap").addClass("slideDownScaleReversedIn").removeClass("slideDownScaleReversedOut");
                } else if ($(window).scrollTop() < banner_height) {
                    jQuery(".header-wrap").removeClass("slideDownScaleReversedIn");
                }
            }
            else {
                if (jQuery(window).scrollTop()) {
                    jQuery(".header-wrap").addClass("slideDownScaleReversedIn").removeClass("slideDownScaleReversedOut");
                }
                else {
                    jQuery(".header-wrap").addClass("slideDownScaleReversedOut").removeClass("slideDownScaleReversedIn");
                }
            }

        }
        else {
            console.log('sticky');
        }
    });

    // Dropdown Menu Hover
    // ---------------------------------------------------------------------------------------
    if (window.matchMedia('(min-width: 768px)').matches) {
        jQuery(".primary-navbar .dropdown").hover(
                function () {
                    jQuery(this).children('.dropdown-menu').hide();
                    jQuery(this).children('.dropdown-menu').slideDown('300');
                },
                function () {
                    jQuery(this).children('.dropdown-menu').slideUp('1000');
                });
    }

    // Scroll To Top Start
    // ---------------------------------------------------------------------------------------
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.to-top').fadeIn();
        } else {
            $('.to-top').fadeOut();
        }
    });
    //Click event to scroll to top
    $('.to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    // Slider Text Animation
    // ---------------------------------------------------------------------------------------
    $(".caption-text").addClass("animated fadeInUp");
    $(".owl-prev,.owl-next").addClass("animated fadeInDown");


    // ---------------------------------------------------------------------------------------
    // Main Slider Start
    $("#main-slider").owlCarousel({
        navigation: true,
        autoPlay: true,
        singleItem: true,
        navigationText: [
            "<i class='fa fa-angle-left'></i>",
            "<i class='fa fa-angle-right'></i>"
        ]
    });
    //Main Slider End
    // ---------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------
    // Testimonials Slider Start
    jQuery(".testimonials-slider").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 1,
        itemsDesktop: [1199, 1],
        itemsTablet: [1024, 1],
        itemsMobile: [768, 1]
    });
    jQuery("#testimonials-slider .next").click(function () {
        jQuery(".testimonials-slider").trigger('owl.next');
    });
    jQuery("#testimonials-slider .prev").click(function () {
        jQuery(".testimonials-slider").trigger('owl.prev');
    });
    // Testimonials Slider End
    // ---------------------------------------------------------------------------------------


    // prettyPhoto
    // ---------------------------------------------------------------------------------------
    $("a[rel^='prettyPhoto']").prettyPhoto({
        theme: 'facebook',
        slideshow: 5000,
        autoplay_slideshow: true
    });


    $('#gallery-filter').isotope({filter: '.photos'});
    // --------------------------------------------------------------------------------------- 
    $(window).trigger('resize').trigger('scroll');
});
$(window).load(function () {
    // Preloder
    // --------------------------------------------------
    $('#loading').delay(1000).fadeOut(200);

    /* ISOTOPE
     ==================================================================*/
    if ($().isotope) {
        var $container = $('.isotope'); // cache container
        $container.isotope({
            itemSelector: '.isotope-item'
        });
        $('.filtrable a').click(function () {
            var selector = $(this).attr('data-filter');
            $('.filtrable li').removeClass('current');
            $(this).parent().addClass('current');
            $container.isotope({filter: selector});
            return false;
        });
        $container.isotope('reLayout'); // layout/reLayout
    }

    $(window).trigger('resize').trigger('scroll');

});

$(document).ready(function () {
    // Video Popup
    // ---------------------------------------------------------------------------------------
    var $doc = $(document);
    $doc.on('hidden.bs.modal', '#video-popup', function () {
        $(this).find('iframe').attr('src', '');
    });
    $doc.on('show.bs.modal', '#video-popup', function (e) {
        var $a = $(e.relatedTarget);
        var src = $a.data('iframe');
        if (src) {
            $(this).find('iframe').attr('src', src);
        }
    });
    // Video Popup End
    // ---------------------------------------------------------------------------------------

    // Audio Player
    // ---------------------------------------------------------------------------------------
    $('.main-player').each(function () {

        function arrayShuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
                ;
            return o;
        }

        var $this = $(this);
        var $list = $this.find('.main-player-list');
        var $content = $this.find('.main-player-song');
        var $loop = $this.find('.main-player-loop');
        var $shuffle = $this.find('.main-player-shuffle');
        var el = $this.find('audio').get(0);

        var init_volume = Math.min(1, Math.max(0, parseFloat($this.data('audioVolume'))));
        var is_shuffle = $this.data('audioShuffle') ? true : false;
        var is_loop = $this.data('audioLoop') ? true : false;
        var index = 0;
        var songs = [];
        var keys = [];
        $list.find('li').each(function () {
            var $li = $(this);
            var song = $li.data();
            if (!song.audio)
                return;
            song.element = $li;
            var key = songs.push(song) - 1;
            keys.push(key);
            $li.data('audioIndex', key);
        });

        var shuffle = arrayShuffle(keys);

        function load(shift, autoplay, player) {

            index += shift;

            if (index >= songs.length) {
                shuffle = arrayShuffle(keys);
                index = 0;
                if (!is_loop)
                    autoplay = false;
            } else if (index < 0) {
                index = songs.length - 1;
            }

            var i = index;

            if (is_shuffle) {
                i = shuffle[i];
            }

            player.load(songs[i].audio);
            if (autoplay) {
                player.play();
            } else {
                player.pause();
            }

            $list.find('.playing').removeClass('playing');

            songs[i].element.addClass('playing');

            $content.html(songs[i].element.html());
        }

        var player = audiojs.create(el, {
            autoplay: $this.data('audioAutoload') ? true : false,
            loop: false,
            preload: true,
            css: false,
            createPlayer: {
                markup: false,
                playPauseClass: 'main-player-play-pause',
                scrubberClass: 'main-player-scrubber',
                progressClass: 'main-player-progress',
                loaderClass: 'main-player-loaded',
                timeClass: 'main-player-time',
                durationClass: 'main-player-duration',
                playedClass: 'main-player-played',
                errorMessageClass: 'main-player-error-message',
                playingClass: 'main-player-playing',
                loadingClass: 'main-player-loading',
                errorClass: 'main-player-error'
            },
            trackEnded: function () {
                load(1, true, this);
            }
        });

        if (init_volume)
            player.setVolume(init_volume);

        $this.data('audiojs', player);

        var volume = {
            wrapper: $this.find('.main-player-volume'),
            element: $this.find('.main-player-volume .main-player-vslider > div'),
            pos: $this.find('.main-player-volume .main-player-vslider b'),
            volume: player.element.volume,
            init: function () {
                volume.element.on('click', volume.change);
                volume.element.on('mousedown', volume.drag);

                $this.on('click', '.main-player-volume-high, .main-player-volume-low', function () {
                    player.setVolume(0);
                    volume.update();
                });

                $this.on('click', '.main-player-volume-off', function () {
                    player.setVolume(volume.volume);
                    volume.update();
                });

                volume.update();
            },
            change: function (e) {
                e.preventDefault();
                var pos = volume.getFrac(e, $(this));
                volume.update(pos * 100);
                player.setVolume(pos);
                volume.volume = pos;
            },
            update: function (percent) {
                var v = typeof percent != 'undefined' ? percent : player.element.volume * 100;
                volume.wrapper.toggleClass('off', v == 0);
                volume.wrapper.toggleClass('half', v > 0 && v <= 50);
                volume.pos.height(v + '%');
            },
            drag: function (e) {
                e.preventDefault();
                $(document).on('mousemove', volume.moveHandler);
                $(document).on('mouseup', volume.stopHandler);
                volume.wrapper.addClass('hover');
            },
            moveHandler: function (e) {
                var pos = volume.getFrac(e, volume.element);
                volume.update(pos * 100);
                player.setVolume(pos);
                volume.volume = pos;
            },
            stopHandler: function () {
                $(document).off('mousemove', volume.moveHandler);
                $(document).off('mouseup', volume.stopHandler);
                volume.wrapper.removeClass('hover');
            },
            getFrac: function (e, $this) {
                return 1 - Math.min(1, Math.max(0, (e.pageY - $this.offset().top) / $this.height()));
            }

        };

        volume.init();

        $this.on('click', '.main-player-list-button', function () {
            $list.toggleClass('opened');
        });

        $this.on('click', '.main-player-next', function () {
            load(1, true, player);
        });

        $this.on('click', '.main-player-prev', function () {
            load(-1, true, player);
        });

        $list.on('click', 'li', function () {
            var i = $(this).data('audioIndex');
            if (i !== null && i >= 0) {
                index = i;
                load(0, true, player);
            }
            $list.removeClass('opened');
        });

        $shuffle.toggleClass('off', !is_shuffle);
        $loop.toggleClass('off', !is_loop);

        $shuffle.click(function () {
            $shuffle.toggleClass('off');
            is_shuffle = !$shuffle.hasClass('off');
        });

        $loop.click(function () {
            $loop.toggleClass('off');
            is_loop = !$loop.hasClass('off');
        });

        load(0, player.settings.autoplay, player);
    });
    // Audio Player End
    // ---------------------------------------------------------------------------------------
});

$(window).resize(function () {
    if ($().isotope) {
        $('.row.isotope').isotope('reLayout'); // layout/relayout on window resize
    }
});
