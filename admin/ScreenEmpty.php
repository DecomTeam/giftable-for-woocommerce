<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Screen.php';
require_once 'CategoryAdmin.php';

/**
 * Empty screen class (default/do nothing screens)
 *
 * @since      0.9.0
 *
 */

class DGFW_ScreenEmpty extends DGFW_Screen {

    private $_category;

    public function __construct($screen)
    {
    }

    protected function define_hooks()
    {

    }

    protected function get_template_vars()
    {
        return array();
    }

    protected function print_template()
    {
        return;
    }

}
