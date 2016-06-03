<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Meta.php';


/**
 * Quantity meta class
 *
 * @since      0.9.0
 *
 */
class DGFW_MetaQuantity extends DGFW_Meta {

    private $_unit;

    public function __construct($raw_meta)
    {
        parent::__construct($raw_meta, 'int');
    }

    public function is_lte($quantity)
    {
        return $this->is_lt($quantity) || $this->is_equal($quantity);
    }

    public function is_gte($quantity)
    {
        return $this->is_gt($quantity) || $this->is_equal($quantity);
    }

    public function is_lt($quantity)
    {
        // empty value means no limits, return true
        return !$this->_value ? true : $this->_value < $quantity;
    }

    public function is_gt($quantity)
    {
        // empty value means no limits, return true
        return !$this->_value ? true : $this->_value > $quantity;
    }

    public function is_equal($quantity)
    {
        return $this->_value == $quantity;
    }

}
