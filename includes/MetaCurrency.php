<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}


require_once 'Meta.php';

/**
 * Currency meta class
 *
 * @since      0.9.0
 *
 */
class DGFW_MetaCurrency extends DGFW_Meta {

    private $_currency;

    public function __construct($raw_meta)
    {
        parent::__construct($raw_meta, 'float');

        $this->_currency = $raw_meta['currency'];
    }

    public function is_lte($amount)
    {
        return $this->is_lt($amount) || $this->is_equal($amount);
    }

    public function is_gte($amount)
    {
        return $this->is_gt($amount) || $this->is_equal($amount);
    }

    public function is_lt($amount)
    {
        // empty value means no limits, return true
        return !$this->_value ? true : ($this->_currency == get_woocommerce_currency() && $this->_value < $amount);
    }

    public function is_gt($amount)
    {
        // empty value means no limits, return true
        return !$this->_value ? true : ($this->_currency == get_woocommerce_currency() && $this->_value > $amount);
    }

    public function is_equal($amount)
    {
        return ($this->_currency == get_woocommerce_currency() && $this->_value == $amount);
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['currency'] = $this->_currency;

        return $meta;
    }

    public function currency()
    {
        return $this->_currency;
    }

}
