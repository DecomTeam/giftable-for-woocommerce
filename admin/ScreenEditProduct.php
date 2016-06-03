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
        );

        return $localization_data;
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
            'description' => __('Giftable products can be offered as free gifts for customers based on any combination of conditions set up as Gift categories...', DGFW::TRANSLATION),
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
        $this->print_template();
    }

    public function save_gift_options($post_id, $post)
    {
        $product_type    = empty( $_POST['product-type'] ) ? 'simple' : sanitize_title( stripslashes( $_POST['product-type'] ) );
        $is_giftable = isset( $_POST['_' . DGFW::GIFT_PRODUCT_OPTION] ) ? 'yes' : 'no';
        $gift_categories = array();
        // die(var_dump(get_post_meta($post_id, '_price', true)));
        if (($is_giftable === 'yes' || $product_type === DGFW::GIFT_PRODUCT_TYPE) && isset($_POST['_dgfw_gift_categories'])) {
            $is_giftable = 'yes';
            foreach ($_POST['_dgfw_gift_categories'] as $gift_category) {
                $gift_categories[] = absint($gift_category);
            }

            if ($product_type === DGFW::GIFT_PRODUCT_TYPE) {
                update_post_meta($post_id, '_visibility', 'hidden');
            }
        }

        update_post_meta($post_id, '_' . DGFW::GIFT_PRODUCT_OPTION, $is_giftable);
        wp_set_post_terms($post_id, $gift_categories, DGFW::GIFTS_TAXONOMY);

        $gift_tabs = isset($_POST['_dgfw_gift_tabs']) ? 'yes' : 'no';
        update_post_meta($post_id, '_dgfw_gift_tabs', $gift_tabs);

        // if product type is any other than gift, create a free gift product variation
        if (($is_giftable === 'yes') && ($product_type !== DGFW::GIFT_PRODUCT_TYPE)) {
            $product_gift_variation = get_posts(
                array(
                    'post_parent' => $post_id,
                    'post_title' => DGFW::GIFT_PRODUCT_OPTION,
                    'post_type' => 'product_variation',
                    'posts_per_page' => 1
                )
            );

            //update product gift variation or create if it doesn't exist yet
            if( !empty($product_gift_variation) ) {

                $post_id = $product_gift_variation[0]->ID;

            } else {

                $user_id = get_current_user_id();

                $gift_variation_args = array(
                    'post_author' => $user_id,
                    'post_status' => 'publish',
                    'post_name' => 'product-' . $post_id . '-' . DGFW::GIFT_PRODUCT_TYPE .  '-variation',
                    'post_parent' => $post_id,
                    'post_title' => DGFW::GIFT_PRODUCT_OPTION,
                    'post_type' => 'product_variation',
                    'comment_status' => 'closed',
                    'ping_status' => 'closed'
                );

                $post_id = wp_insert_post( $gift_variation_args );

            }


            update_post_meta($post_id, '_visibility', 'hidden');
            update_post_meta($post_id, '_price', 0);
            update_post_meta($post_id, '_regular_price', 0);
            update_post_meta($post_id, '_sold_individually', 'yes');
            update_post_meta($post_id, '_' . DGFW::GIFT_PRODUCT_OPTION, $is_giftable);
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
}
