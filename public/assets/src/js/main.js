(function($) {

    $(document).ready(function() {
        var $dgfwCarousel = $('#dgfw-gifts-carousel');
        var $dgfwVariations = $('#dgfw-gift-variations');
        var $cartForm = false;

        $('body').on('click', '.dgfw-add-gift-button', function(event) {
            event.preventDefault();

            $('#dgfw_chosen_gift').val($(this).data('gift'));

            // clear giftable variations div so as not to submit its form
            // values in case it has been opened
            $('#dgfw-gift-variations').html('');

            submitCartForm();
        });

        function submitCartForm() {
            // we're going to need the form element for later
            $cartForm = $(this).closest('form');

            // check if we're working with WC2.6 ajax cart or older version
            if ( typeof wc_cart_params === 'undefined' ) {
                // if older submit form
                $cartForm.trigger('submit');
            } else {
                // trigger ajax event
                $(document).trigger('wc_update_cart');
            }
        }

        function slidesToShowForCurrentWidth() {
            var currentWindowWidth = $(window).width();

            if (currentWindowWidth <= 600) {
                return parseInt(decomGiftable.carouselSlides.small);
            } else if (currentWindowWidth <= 1024) {
                return parseInt(decomGiftable.carouselSlides.medium);
            }

            return parseInt(decomGiftable.carouselSlides.large);
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
                        slidesToShow: parseInt(decomGiftable.carouselSlides.large),
                        slidesToScroll: parseInt(decomGiftable.carouselSlides.large),
                        responsive: [
                        {
                          breakpoint: 1024,
                          settings: {
                            slidesToShow: parseInt(decomGiftable.carouselSlides.medium),
                            slidesToScroll: parseInt(decomGiftable.carouselSlides.medium),
                            infinite: true,
                            dots: true
                          }
                        },
                        {
                          breakpoint: 600,
                          settings: {
                            slidesToShow: parseInt(decomGiftable.carouselSlides.small),
                            slidesToScroll: parseInt(decomGiftable.carouselSlides.small)
                          }
                        }
                        ]
                    });
                    $dgfwCarousel.data('is-slick', true);
                } else {
                    // show gifts without carousel
                    $dgfwCarousel.addClass('no-slick-needed');
                }
            }
        }

        // select options for gifts with variations
        $('body').on('click', '.dgfw-select-gift-button', function(event) {
            event.preventDefault();

            // make sure we're working with the latest reference to the element
            $dgfwVariations = $('#dgfw-gift-variations');

            var productId = $(this).data('gift');

            loadAndDisplayGiftableVariations(productId);

        });

        function loadAndDisplayGiftableVariations(productId) {
            $dgfwVariations.addClass('loading');

            $.ajax(decomGiftable.ajaxUrl, {
                type: 'POST',
                data: {
                    action: 'dgfw_get_giftable_variations_html',
                    security: decomGiftable.security,
                    product_id: productId,
                },
                success: function displayGiftableVariations(response) {
                    $dgfwVariations.html(response.data.html);
                    if ( typeof wc_add_to_cart_variation_params !== 'undefined' ) {
                        $dgfwVariations.find( '.variations_form' ).each( function() {
                            $( this ).wc_variation_form().find('.variations select:eq(0)').change();
                        });
                    }
                    $dgfwVariations.removeClass('loading');
                }
            });
        }


        // handle variation add to car button
        $('body').on('click', '#dgfw-gift-variations .single_add_to_cart_button', function (event) {
            // if disabled the wc script takes care of blocking it
            // we need to handle only the final form submission
            var $this = $( this );

            if ( !$this.is('.disabled') ) {
                event.preventDefault();
                event.stopPropagation();

                var variation_id = $dgfwVariations.find('input[name="variation_id"]').val();
                $('#dgfw_chosen_gift').val(variation_id);

                submitCartForm();

            }
        });


        initNewCarousel();

        // use the new WC2.6 events for reinitializing slick when new cart
        // is loaded
        $(document).on('updated_wc_div',initNewCarousel);
        // maybe reinitialize new carousel on window resize
        $(window).on('resize', initNewCarousel);
    });

}(jQuery));