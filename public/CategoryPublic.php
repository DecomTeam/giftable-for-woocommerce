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
	        'tax_query' => array(
	            array(
	                'taxonomy' => DGFW::GIFTS_TAXONOMY,
	                'field' => 'id',
	                'terms' => array($this->_term->term_id)
	            )
	        ),
	        'meta_key' => '_' . DGFW::GIFT_PRODUCT_OPTION,
	        'meta_value' => 'yes',
	    );

	    $args['posts_per_page'] = $limit ? $limit : -1;

	    if ($offset) {
	        $args['offset'] = $offset;
	    }

	    $gifts = array();

	    $giftable = get_posts($args);

	    foreach ($giftable as $giftable_product) {
	    	$product = WC()->product_factory->get_product($giftable_product);

	    	if ($product->get_type() === DGFW::GIFT_PRODUCT_TYPE) {
	    		$gifts['gift_' . $product->id] = $product;
	    	} else {
	    		$product_gift_variation = get_posts(
	    		    array(
	    		        'post_parent' => $giftable_product->ID,
	    		        'post_title' => DGFW::GIFT_PRODUCT_OPTION,
	    		        'post_type' => 'product_variation',
	    		        'posts_per_page' => 1
	    		    )
	    		);

	    		//update product gift variation or create if it doesn't exist yet
	    		if( !empty($product_gift_variation) ) {
	    			$gift_variation = new WC_Product_Variation($product_gift_variation[0]);
	    		    $gifts['gift_' . $gift_variation->id] = $gift_variation;

	    		}
	    	}
	    }

	    return $gifts;
	}


}
