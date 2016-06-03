(function($) {

    $(document).ready(function() {
        var $dgfwCarousel = $('#dgfw-gifts-carousel');
        var $cartForm = false;

        $('body').on('click', '.dgfw-add-gift-button', function(event) {
            event.preventDefault();

            $('#dgfw_chosen_gift').val($(this).data('gift'));

            // we're going to need the form element for later
            $cartForm = $(this).closest('form');

            // this submits the form for WC2.5-
            $cartForm.trigger('submit');

            // for WC2.6+ the above form submit does nothing, we need to
            // trigger the new wc_update_cart event
            $(document).trigger('wc_update_cart');
        });

        function initNewCarousel() {
            // get the latest versions of html elements
            $dgfwCarousel = $('#dgfw-gifts-carousel');

            if (!$dgfwCarousel.data('is-slick')) {
                $dgfwCarousel.slick({
                    dots: true,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    responsive: [
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true
                      }
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                      }
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                      }
                    }
                    ]
                });
                $dgfwCarousel.data('is-slick', true);
            }
        }

        initNewCarousel();

        // use the new WC2.6 events for reinitializing slick when new cart
        // is loaded
        $(document).on('updated_wc_div',initNewCarousel);
    });

}(jQuery));