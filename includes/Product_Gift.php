<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * WooCommerce Product Type Class for Gifts
 *
 * @since      0.9.0
 *
 */

// make sure we have a class to extend
if (class_exists('WC_Product_Simple')) :

    class WC_Product_Dgfw_Gift extends WC_Product_Simple {

        public function __construct( $product ) {

            parent::__construct( $product );

            $this->product_type = DGFW::GIFT_PRODUCT_TYPE;
        }

    }

endif;