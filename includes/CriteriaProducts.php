<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Criteria.php';
require_once 'MetaPosts.php';

/**
 * Products criteria class
 *
 * @since      0.9.0
 *
 */
class DGFW_CriteriaProducts extends DGFW_Criteria {

    private $_products;

    public function __construct($conditions)
    {
        parent::__construct($conditions);

        $this->_products = new DGFW_MetaPosts($conditions['posts']);
    }

    protected function check_self()
    {
        $this->_checks_out = $this->_products->check_for(DGFW_Public::get_cart_products());
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['posts'] = $this->_products->meta();

        return $meta;
    }

}
