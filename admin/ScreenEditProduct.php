<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Screen.php';

/**
 * Edit product screen class
 *
 * @since      0.9.0
 *
 */

class DGFW_ScreenEditProduct extends DGFW_Screen {

    private $_product_types;

    public function __construct($screen)
    {

        parent::__construct($screen);

        $this->_template = 'product-gift-options';


    }

    protected function define_hooks()
    {
        parent::define_hooks();

        add_action( 'woocommerce_product_data_panels', array($this, 'gift_data_tab_content') );
        // save gift product type gift options
        add_action( 'save_post_product', array($this, 'save_gift_options'), 10, 2);
        // save variable product variations
        add_action( 'woocommerce_variable_product_sync_data', array('DGFW_ScreenEditProduct', 'save_giftable_variations'), 99, 2 );
        // add variable bulk edit actions

        // Maybe add in next versions...
        // add_action( 'woocommerce_variable_product_bulk_edit_actions', array($this, 'variable_bulk_edit_actions'), 10 );

        // update price meta fields for gift product type
        add_action( 'woocommerce_process_product_meta_' . DGFW::GIFT_PRODUCT_TYPE, array($this, 'update_gift_price_fields'), 10, 1 );
        // remove default gift category meta box since we're managing it in product options tab
        add_action( 'pre_get_posts', array($this, 'remove_gift_category_meta_box') );

        // gift product type filters
        add_filter( 'product_type_selector', array($this, 'add_product_types'), 10, 1 );
        add_filter( 'woocommerce_product_data_tabs', array($this, 'gift_data_tabs' ), 10, 1 );
        add_filter( 'product_type_options', array($this, 'add_product_type_options'), 10, 1);
    }

    public function localize_script($localization_data)
    {
        $localization_data['screen'] = array(
            'name' => 'edit-product',
            'translations' => $this->translations(),
        );

        return $localization_data;
    }

    public function translations()
    {
        return array(
            'Giftable' => __('Giftable', DGFW::TRANSLATION),
        );
    }

    public function add_product_types($types)
    {
        $types[ DGFW::GIFT_PRODUCT_TYPE ] = __( 'Gift', DGFW::TRANSLATION );

        return $types;
    }

    public function gift_data_tabs($tabs)
    {
        $tabs['inventory']['class'][] = 'show_if_' . DGFW::GIFT_PRODUCT_TYPE;

        $tabs['dgfw-gift-tab'] = array(
            'label'     => __( 'Gift options', DGFW::TRANSLATION ),
            'target'    => DGFW::GIFT_PRODUCT_TYPE,
            'class'     => array( 'show_if_' . DGFW::GIFT_PRODUCT_TYPE, 'hide_if_simple', 'hide_if_variable', 'hide_if_grouped', 'hide_if_external', 'show_if_' . DGFW::GIFT_PRODUCT_OPTION  ),
        );
        return $tabs;

    }

    public function add_product_type_options($options)
    {
        $options[DGFW::GIFT_PRODUCT_OPTION] = array(
            'id' => '_' . DGFW::GIFT_PRODUCT_OPTION,
            'wrapper_class' => 'show_if_simple show_if_virtual show_if_variable show_if_downloadable show_if_grouped show_if_external hide_if_' . DGFW::GIFT_PRODUCT_TYPE,
            'label' => __('Giftable', DGFW::TRANSLATION),
            'description' => __('Giftable products can be offered as free gifts for customers based on any combination of conditions set up as Gift categories (assigned to a product in the Gift options tab below). If a variable product is marked as giftable, all of its variations will be giftable too. To mark only some variations as giftable, edit them in the Variations tab.', DGFW::TRANSLATION),
            'default' => 'no',
        );

        return $options;
    }

    public function gift_data_tab_content()
    {
        $this->_template_vars['panel_id'] = DGFW::GIFT_PRODUCT_TYPE;
        $this->_template_vars['gift_categories'] = DGFW::gift_categories();
        $this->_template_vars['product_gift_categories'] = wp_get_post_terms(get_the_ID(), DGFW::GIFTS_TAXONOMY, array('fields' => 'ids'));
        $this->_template_vars['gift_tabs'] = get_post_meta(get_the_ID(), '_dgfw_gift_tabs', true);
        $this->_template_vars['has_giftable_variations'] = get_post_meta(get_the_ID(), '_dgfw_has_giftable_variations', true);
        $this->_template_vars['is_giftable'] = get_post_meta(get_the_ID(), '_' . DGFW::GIFT_PRODUCT_OPTION, true);
        $this->print_template();
    }

    public function save_gift_options($post_id, $post)
    {
        $product_type    = empty( $_POST['product-type'] ) ? 'simple' : sanitize_title( stripslashes( $_POST['product-type'] ) );
        $is_giftable = isset( $_POST['_' . DGFW::GIFT_PRODUCT_OPTION] ) ? 'yes' : 'no';
        $was_giftable = isset( $_POST['_dgfw_was_giftable']) ? wc_clean($_POST['_dgfw_was_giftable']) : 'no';
        $has_giftable_variations = isset( $_POST['_dgfw_has_giftable_variations'] ) && $_POST['_dgfw_has_giftable_variations'] === 'yes' ? 'yes' : 'no';

        $gift_categories = array();

        // set gift categories only if product is marked as giftable in any way
        if (
            ($is_giftable === 'yes'
                || ($has_giftable_variations === 'yes' && $was_giftable === 'no')
                || $product_type === DGFW::GIFT_PRODUCT_TYPE
            )
            && isset($_POST['_dgfw_gift_categories'])
        ) {
            foreach ($_POST['_dgfw_gift_categories'] as $gift_category) {
                $gift_categories[] = absint($gift_category);
            }
        }

        // die(var_dump($has_giftable_variations, $gift_categories));
        // gift products are always giftable & hidden
        if ($product_type === DGFW::GIFT_PRODUCT_TYPE) {
            $is_giftable = 'yes';
            update_post_meta($post_id, '_visibility', 'hidden');
        }

        update_post_meta($post_id, '_' . DGFW::GIFT_PRODUCT_OPTION, $is_giftable);
        wp_set_post_terms($post_id, $gift_categories, DGFW::GIFTS_TAXONOMY);

        $gift_tabs = isset($_POST['_dgfw_gift_tabs']) ? 'yes' : 'no';
        update_post_meta($post_id, '_dgfw_gift_tabs', $gift_tabs);

        // if product type is any other than gift, create/update/delete a free gift
        // product variation depending on the giftable option value
        if ($product_type !== DGFW::GIFT_PRODUCT_TYPE) {

            self::update_product_giftable_variation($post_id, $is_giftable);

        }

        if ($product_type === 'variable') {
            self::save_giftable_variations($post_id);
        }

    }

    public function update_gift_price_fields($post_id)
    {
        update_post_meta($post_id, '_price', 0);
        update_post_meta($post_id, '_regular_price', 0);
        update_post_meta($post_id, '_sold_individually', 'yes');
    }

    public function remove_gift_category_meta_box()
    {
        remove_meta_box('tagsdiv-' . DGFW::GIFTS_TAXONOMY, $this->_wp_screen->id, 'side');
    }

    public static function variation_giftable_option($loop, $variation_data, $variation)
    {
        $variation_is_giftable = get_post_meta($variation->ID, '_' . DGFW::GIFT_VARIATION_OPTION, true);

        DGFW_Admin::print_template('variation-giftable-option', array(
            'loop' => $loop,
            'variation' => $variation,
            'giftable' => $variation_is_giftable
        ));
    }

    /**
     *
     * Save/update/delete giftable variations for variable products
     *
     */
    public static function save_giftable_variations($product_id)
    {
        $product = wc_get_product( $product_id );
        $children = $product->get_visible_children();

        $post = get_post($product_id);

        // we'll make all variations giftable or not for a certain combination of these two
        $product_is_giftable = isset( $_POST['_' . DGFW::GIFT_PRODUCT_OPTION] ) ? 'yes' : 'no';
        $product_was_giftable = isset( $_POST['_dgfw_was_giftable']) ? wc_clean($_POST['_dgfw_was_giftable']) : 'no';

        $variable_post_id = isset($_POST['variable_post_id']) ? $_POST['variable_post_id'] : array();

        $variable_is_giftable = isset( $_POST['variable_is_giftable'] ) ? $_POST['variable_is_giftable'] : array();

        // loop through all children only if product is giftable
        // or was giftable but not any more (make/clear all gifatble variations)
        if (
            $children
            && (
                $product_is_giftable === 'yes'
                || ($product_is_giftable === 'no' && $product_was_giftable === 'yes')
                )
        ) {
            // if we work with all children, that means we're saving all variations,
            // so we have to combine the variation keys/IDs with the way
            // WC submits variation ids and giftable values
            // (we get only one page of variations, but we may need to update all)
            $submitted_giftables = $variable_is_giftable;
            $variable_is_giftable = array();

            foreach ($children as $key => $child_id) {
                if (in_array($child_id, $variable_post_id)) {
                    $variable_post_key = array_search($child_id, $variable_post_id);
                    if (isset($submitted_giftables[$variable_post_key])) {
                        $variable_is_giftable[$key] = $submitted_giftables[$variable_post_key];
                    }
                }
            }

            $variable_post_id = $children;

        }

        $max_loop = count($variable_post_id) ?  max( array_keys( $variable_post_id ) ) : 0;

        // start with either the submitted value, or the previously stored value
        // for the post if it's not submitted (when saving via ajax)
        $product_has_giftable_variations =
            isset($_POST['_dgfw_has_giftable_variations'])
                ? wc_clean($_POST['_dgfw_has_giftable_variations'])
                : get_post_meta($product_id, '_dgfw_has_giftable_variations', true);

        for ( $i = 0; $i <= $max_loop; $i ++ ) {

            if ( ! isset( $variable_post_id[ $i ] ) ) {
                continue;
            }

            $variation_id = absint( $variable_post_id[ $i ] );

            if ($product_is_giftable === 'yes') {
                // If product is giftable, all variations are giftable too
                $is_giftable = 'yes';
            } else if ($product_was_giftable === 'yes') {
                // If product was giftable but not any more, we clear all variations
                $is_giftable = 'no';
            } else {
                // if neither, check if variation is giftable itself
                $is_giftable = isset( $variable_is_giftable[ $i ] ) ? 'yes' : 'no';
            }

            if ($variation_id) {
                update_post_meta($variation_id, '_' . DGFW::GIFT_VARIATION_OPTION, $is_giftable);

                // create/update/delete a hidden giftable copy of the variation
                // depending on the value of its giftable field
                $variation_gift_variation = get_posts(
                    array(
                        'post_parent' => $product_id,
                        'post_title' => DGFW::GIFT_VARIATION_OPTION,
                        'post_type' => 'product_variation',
                        'post_status' => DGFW::GIFT_POST_STATUS,
                        'meta_query' => array(
                            'relation' => 'AND',
                            array(
                                'key' => '_' . DGFW::GIFT_VARIATION_OPTION,
                                'value' => 'yes',
                            ),
                            array(
                                'key' => '_' . DGFW::GIFT_VARIATION_OPTION . '_original',
                                'value' => $variation_id,
                            ),
                        ),
                        'posts_per_page' => 1
                    )
                );

                if ($is_giftable === 'yes') {

                    //update variation gift variation or create if it doesn't exist yet
                    if( !empty($variation_gift_variation) ) {

                        $giftable_variation_id = $variation_gift_variation[0]->ID;

                    } else {

                        $user_id = get_current_user_id();

                        $giftable_variation_args = array(
                            'post_author' => $user_id,
                            'post_status' => DGFW::GIFT_POST_STATUS,
                            'post_name' => 'variation-' . $variation_id . '-' . DGFW::GIFT_PRODUCT_TYPE .  '-variation',
                            'post_parent' => $product_id,
                            'post_title' => 'Variation #' . $variation_id . ' (Giftable)' ,
                            'post_type' => 'product_variation',
                            'comment_status' => 'closed',
                            'ping_status' => 'closed'
                        );

                        $giftable_variation_id = wp_insert_post( $giftable_variation_args );

                    }


                    update_post_meta($giftable_variation_id, '_visibility', 'hidden');
                    update_post_meta($giftable_variation_id, '_price', 0);
                    update_post_meta($giftable_variation_id, '_regular_price', 0);
                    update_post_meta($giftable_variation_id, '_sold_individually', 'yes');
                    update_post_meta($giftable_variation_id, '_' . DGFW::GIFT_VARIATION_OPTION, $is_giftable);
                    update_post_meta($giftable_variation_id, '_' . DGFW::GIFT_VARIATION_OPTION . '_original', $variation_id);

                    // mark parent product
                    $product_has_giftable_variations = 'yes';

                } else if ( !empty($variation_gift_variation) ) {
                    $giftable_variation_id = $variation_gift_variation[0]->ID;

                    wp_delete_post($giftable_variation_id, true);

                }
            }
        } // end variations loop

        // update parent product giftable option
        update_post_meta($product_id, '_dgfw_has_giftable_variations', $product_has_giftable_variations);
        self::update_product_giftable_variation($product_id, $product_has_giftable_variations);

    }

    public static function update_product_giftable_variation($product_id, $is_giftable)
    {
        $product_gift_variation = get_posts(
            array(
                'post_parent' => $product_id,
                'post_type' => 'product_variation',
                'post_status' => DGFW::GIFT_POST_STATUS,
                'meta_key' => '_' . DGFW::GIFT_PRODUCT_OPTION,
                'meta_value' => 'yes',
                'posts_per_page' => 1
            )
        );

        if ($is_giftable === 'yes') {

            //update product gift variation or create if it doesn't exist yet
            if( !empty($product_gift_variation) ) {

                $gift_id = $product_gift_variation[0]->ID;

            } else {

                $user_id = get_current_user_id();

                $gift_variation_args = array(
                    'post_author' => $user_id,
                    'post_status' => DGFW::GIFT_POST_STATUS,
                    'post_name' => 'product-' . $product_id . '-' . DGFW::GIFT_PRODUCT_TYPE .  '-variation',
                    'post_parent' => $product_id,
                    'post_title' => DGFW::GIFT_PRODUCT_OPTION,
                    'post_type' => 'product_variation',
                    'comment_status' => 'closed',
                    'ping_status' => 'closed'
                );

                $gift_id = wp_insert_post( $gift_variation_args );

            }


            update_post_meta($gift_id, '_visibility', 'hidden');
            update_post_meta($gift_id, '_price', 0);
            update_post_meta($gift_id, '_regular_price', 0);
            update_post_meta($gift_id, '_sold_individually', 'yes');
            update_post_meta($gift_id, '_' . DGFW::GIFT_PRODUCT_OPTION, $is_giftable);

        } else if ( !empty($product_gift_variation) ) {
            $gift_id = $product_gift_variation[0]->ID;

            wp_delete_post($gift_id, true);

        }
    }

    public function variable_bulk_edit_actions()
    {
        DGFW_Admin::print_template('variable-actions', array());
    }

}
