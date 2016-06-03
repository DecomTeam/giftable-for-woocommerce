<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * Screen abstract class, extended by individual screen classes
 *
 * @since      0.9.0
 *
 */

abstract class DGFW_Screen {

    protected $_wp_screen;

    protected $_template;

    protected $_template_vars = array();

    protected $_errors;

    public function __construct($screen)
    {
        $this->_wp_screen = $screen;

        $this->define_hooks();
    }

    protected function define_hooks()
    {
        add_filter( 'dgfw_admin_localize_script', array($this, 'localize_script'), 10, 1 );
    }

    public function localize_script($localization_data)
    {
        return $localization_data;
    }

    protected function print_template()
    {
        DGFW_Admin::print_template($this->_template, $this->_template_vars);
    }

    protected function have_errors()
    {
        return !empty($this->_errors);
    }

}
