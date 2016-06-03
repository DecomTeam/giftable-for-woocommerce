<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Criteria.php';
require_once 'MetaCurrency.php';

/**
 * Amounts criteria class
 *
 * @since      0.9.0
 *
 */
class DGFW_CriteriaAmounts extends DGFW_Criteria {

    private $_min_amount;
    private $_max_amount;

    public function __construct($conditions)
    {
        parent::__construct($conditions);

        $this->_min_amount = new DGFW_MetaCurrency($conditions['min_amount']);
        $this->_max_amount = new DGFW_MetaCurrency($conditions['max_amount']);
    }

    protected function check_self()
    {
        $total = WC()->cart->subtotal;

        $this->_checks_out = $this->_min_amount->is_lte($total) && $this->_max_amount->is_gte($total);
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['min_amount'] = $this->_min_amount->meta();
        $meta['max_amount'] = $this->_max_amount->meta();

        return $meta;
    }
}
