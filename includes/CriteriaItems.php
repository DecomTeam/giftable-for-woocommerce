<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Criteria.php';
require_once 'MetaQuantity.php';

/**
 * Items criteria class
 *
 * @since      0.9.0
 *
 */
class DGFW_CriteriaItems extends DGFW_Criteria {

    private $_min_items;
    private $_max_items;

    public function __construct($conditions)
    {
        parent::__construct($conditions);

        $this->_min_items = new DGFW_MetaQuantity($conditions['min_items']);
        $this->_max_items = new DGFW_MetaQuantity($conditions['max_items']);
    }

    protected function check_self()
    {
        $count = DGFW_Public::get_cart_product_count();

        $this->_checks_out = $this->_min_items->is_lte($count) && $this->_max_items->is_gte($count);
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['min_items'] = $this->_min_items->meta();
        $meta['max_items'] = $this->_max_items->meta();

        return $meta;
    }

}
