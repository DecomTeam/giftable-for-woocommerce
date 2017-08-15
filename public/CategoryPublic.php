<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once plugin_dir_path( dirname(__FILE__) ) . 'includes/Category.php';

/**
 * Public category class
 *
 * @since      0.9.0
 *
 */
class DGFW_CategoryPublic extends DGFW_Category {


	public function get_gifts($limit = false, $offset = false)
	{


	    $args = array(
	        'post_type' => 'product',
	        'post_status' => array('publish', DGFW::GIFT_POST_STATUS),
	        'tax_query' => array(
	            array(
	                'taxonomy' => DGFW::GIFTS_TAXONOMY,
	                'field' => 'id',
	                'terms' => array($this->_term->term_id)
	            )
	        ),
	        'meta_query' => array(
	        	'relation' => 'OR',
	        	array(
	        		'key' => '_' . DGFW::GIFT_PRODUCT_OPTION,
	        		'value' => 'yes',
        		),
        		array(
        			'key' => '_dgfw_has_giftable_variations',
        			'value' => 'yes',
    			),
        	),
	    );

	    $args['posts_per_page'] = $limit ? $limit : -1;

	    if ($offset) {
	        $args['offset'] = $offset;
	    }

	    $gifts = array();


	    $giftable = get_posts($args);

	    foreach ($giftable as $giftable_product) {
	    	$product = WC()->product_factory->get_product($giftable_product);

    		// Gift vs variable gift vs giftable-variable vs giftable variations... :S
	    	if (in_array($product->get_type(), array(DGFW::GIFT_PRODUCT_TYPE, 'variable'))) {
	    		$gifts['gift_' . $product->get_id()] = $product;
	    	} else {
	    		// the product is of another type
	    		$product_gift_variation = get_posts(
	    		    array(
	    		        'post_parent' => $giftable_product->ID,
	    		        'post_type' => 'product_variation',
	    		        'post_status' => array('publish', DGFW::GIFT_POST_STATUS),
	    		        'meta_key' => '_' . DGFW::GIFT_PRODUCT_OPTION,
	    		        'meta_value' => 'yes',
	    		        'posts_per_page' => 1
	    		    )
	    		);

	    		if( !empty($product_gift_variation) ) {
	    			$gift_variation = new WC_Product_Variation($product_gift_variation[0]);
	    		    $gifts['gift_' . $gift_variation->get_id()] = $gift_variation;
	    		} else if ($product->get_type() === 'variable') {
	    			// this means the product is not marked as giftable, but some
	    			// of its variations are, make it available as gift and
	    			// users will be able to choose between giftable variations
	    			$gifts['gift_' . $product->get_id()] = $product;
	    		}
	    	}
	    }

	    return $gifts;
	}


}
