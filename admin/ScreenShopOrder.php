<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Screen.php';

/**
 * Order details admin page
 *
 * @since      1.0.0
 *
 */

class DGFW_ScreenShopOrder extends DGFW_Screen {

    private $_product_types;

    public function __construct($screen)
    {
        parent::__construct($screen);

        $this->_template = 'order-giftable-note';

    }

    protected function define_hooks()
    {
        parent::define_hooks();

        add_action( 'woocommerce_before_order_itemmeta', array($this, 'before_order_itemmeta'), 10, 3 );
    }

    public function localize_script($localization_data)
    {
        $localization_data['screen'] = array(
            'name' => 'shop-order',
        );

        return $localization_data;
    }

    /**
     *
     * Add a note to gift items on the order page
     *
     */
    public function before_order_itemmeta($item_id, $item, $_product)
    {
        // die(var_dump($item->get_meta_data()));
        if ($item->get_meta('_is_giftable')) {
            $item->delete_meta_data('_is_giftable');
            
            $this->print_template();
        }
    }

}