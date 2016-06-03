<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Screen.php';

/**
 * Plugin settings (WooCommerce options tab) screen class
 *
 * @since      0.9.0
 *
 */

class DGFW_ScreenSettings extends DGFW_Screen {

    private $_product_types;

    public function __construct($screen)
    {
        parent::__construct($screen);

        $this->_template = 'settings-tab';


    }

    protected function define_hooks()
    {
        parent::define_hooks();

        add_filter( 'woocommerce_get_settings_pages', array($this, 'woocommerce_get_settings_pages'), 10, 1 );
    }

    public function localize_script($localization_data)
    {
        $localization_data['screen'] = array(
            'name' => 'settings-tab',
        );

        return $localization_data;
    }

    // Include our settings class on woocommerce settings page
    public function woocommerce_get_settings_pages($settings)
    {
        $settings[] = include( plugin_dir_path( dirname( __FILE__ ) ) . 'admin/Settings.php' );
        return $settings;
    }

}
