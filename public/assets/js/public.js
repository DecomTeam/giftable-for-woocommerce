(function () {
    'use strict';

    (function ($) {

        $(document).ready(function () {
            var $dgfwCarousel = $('#dgfw-gifts-carousel');
            var $cartForm = false;

            $('body').on('click', '.dgfw-add-gift-button', function (event) {
                event.preventDefault();

                $('#dgfw_chosen_gift').val($(this).data('gift'));

                // we're going to need the form element for later
                $cartForm = $(this).closest('form');

                // check if we're working with WC2.6 ajax cart or older version
                if (typeof wc_cart_params === 'undefined') {
                    // if older submit form
                    $cartForm.trigger('submit');
                } else {
                    // trigger ajax event
                    $(document).trigger('wc_update_cart');
                }
            });

            function slidesToShowForCurrentWidth() {
                var currentWindowWidth = $(window).width();

                if (currentWindowWidth <= 480) {
                    return 1;
                } else if (currentWindowWidth <= 600) {
                    return 2;
                } else if (currentWindowWidth <= 1024) {
                    return 3;
                }

                return 5;
            }

            function initNewCarousel() {
                // get the latest versions of html elements
                $dgfwCarousel = $('#dgfw-gifts-carousel');

                if (!$dgfwCarousel.data('is-slick')) {
                    var $gifts = $dgfwCarousel.find('.dgfw-gift');

                    // initialize slick only if there's more than one row of available gifts
                    if ($gifts.length > slidesToShowForCurrentWidth()) {
                        $dgfwCarousel.slick({
                            dots: true,
                            infinite: false,
                            speed: 300,
                            slidesToShow: 5,
                            slidesToScroll: 5,
                            responsive: [{
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                    infinite: true,
                                    dots: true
                                }
                            }, {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            }, {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }]
                        });
                        $dgfwCarousel.data('is-slick', true);
                    } else {
                        // show gifts without carousel
                        $dgfwCarousel.addClass('no-slick-needed');
                    }
                }
            }

            initNewCarousel();

            // use the new WC2.6 events for reinitializing slick when new cart
            // is loaded
            $(document).on('updated_wc_div', initNewCarousel);
            // maybe reinitialize new carousel on window resize
            $(window).on('resize', initNewCarousel);
        });
    })(jQuery);

}());