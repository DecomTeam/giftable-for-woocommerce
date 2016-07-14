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

/**
 * After Single Products Summary Div.
 *
 * @see woocommerce_output_product_data_tabs()
 * @see woocommerce_upsell_display()
 * @see woocommerce_output_related_products()
 */
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs', 10 );
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_upsell_display', 15 );
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );

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