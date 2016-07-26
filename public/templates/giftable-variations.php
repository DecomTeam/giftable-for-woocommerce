<?php
/**
 *
 * Giftable variations for a specified product (loaded via ajax)
 *
 * vars:
 * $post
 * $product
 * $variations
 *
 */
// We use WC's single-product template, just remove stuff we don't need here

// no tumbnails
remove_action( 'woocommerce_product_thumbnails', 'woocommerce_show_product_thumbnails', 20 );

// clear all after_single_product_summary hooks
// we do it this way because there's no way to know what's added by custom themes
global $wp_filter;
if (isset($wp_filter['woocommerce_after_single_product_summary'])) {
    $wp_filter['woocommerce_after_single_product_summary'] = array();
}

/**
 * Product Summary Box.
 *
 * @see woocommerce_template_single_title()
 * @see woocommerce_template_single_rating()
 * @see woocommerce_template_single_price()
 * @see woocommerce_template_single_excerpt()
 * @see woocommerce_template_single_meta()
 * @see woocommerce_template_single_sharing()
 */
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_sharing', 50 );

?>
<div class="dgfw-product-giftable-variations product" id="dgfw-product-<?php echo $product->id; ?>-variations">
    <?php wc_get_template_part( 'content', 'single-product' ); ?>
</div>