<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Screen.php';

/**
 * Products screen class
 *
 * @since      0.9.0
 *
 */

class DGFW_ScreenProducts extends DGFW_Screen {

    private $_product_types;

    public function __construct($screen)
    {

        parent::__construct($screen);

        $this->_template = 'products';


    }

    protected function define_hooks()
    {
        parent::define_hooks();

        add_filter( 'woocommerce_product_filters', array($this, 'product_filters'), 10, 1 );
        add_filter( 'parse_query', array( $this, 'product_filters_query' ), 10, 1 );
    }

    public function localize_script($localization_data)
    {
        $localization_data['screen'] = array(
            'name' => 'products',
        );

        return $localization_data;
    }

    public function product_filters($output)
    {
        // WC saves otuputs product type term ucfirst(slug), so we need to replace it with a proper name
        return str_replace(ucfirst(DGFW::GIFT_PRODUCT_TYPE), __('Gifts and giftable products', DGFW::TRANSLATION), $output) . $this->gift_categories_dropdown();
    }

    public function product_filters_query($query)
    {
        global $typenow, $wp_query;

        if ( 'product' == $typenow ) {

            if ( (isset( $query->query_vars['product_type'] ) && $query->query_vars['product_type'] === DGFW::GIFT_PRODUCT_TYPE) ) {
                $query->query_vars['product_type']  = '';
                $query->query_vars['meta_value']    = 'yes';
                $query->query_vars['meta_key']      = '_' . DGFW::GIFT_PRODUCT_OPTION;
            }
        }
    }

    /**
     *
     * Quick edit save product - always save gift product type visibility as hidden
     *
     */
    public static function product_quick_edit_save($product)
    {
        if ($product->is_type(DGFW::GIFT_PRODUCT_TYPE)) {
            update_post_meta($product->id, '_visibility', 'hidden');
        }
    }

    /**
     *
     * Gift categories dropdown
     *
     */
    public function gift_categories_dropdown()
    {
        global $wp_query;

        $current_gift_cat = isset( $wp_query->query_vars[DGFW::GIFTS_TAXONOMY] ) ? $wp_query->query_vars[DGFW::GIFTS_TAXONOMY] : '';

        $terms = DGFW::gift_categories(true);

        if ( ! $terms ) {
            return;
        }

        $output  = "<select name='" . DGFW::GIFTS_TAXONOMY . "' class='dropdown_gift_cat'>";
        $output .= '<option value="" ' .  selected( $current_gift_cat, '', false ) . '>' . __( 'Select a gift category', DGFW::TRANSLATION ) . '</option>';

        foreach ($terms as $gift_cat) {
            $output .= '<option value="' . $gift_cat['name'] . '" ' . selected($current_gift_cat, $gift_cat['name'], false) . '>' . esc_html($gift_cat['title']) . '</option>';
        }

        $output .= "</select>";

        return $output;
    }


}
