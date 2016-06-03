<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * Abscract meta class
 *
 * @since      0.9.0
 *
 */

abstract class DGFW_Meta {

    protected $_value;

    public function __construct($raw_meta, $value_type = 'string')
    {
        $check_method = method_exists($this, 'check_' . $value_type) ? 'check_' . $value_type : 'check_string';
        $this->_value = $this->$check_method($raw_meta['value']);
    }

    protected function check_string($raw_string)
    {
        return (string) $raw_string;
    }

    protected function check_array($raw_array)
    {
        return (array) $raw_array;
    }

    protected function check_bool($raw_bool)
    {
        return (bool) $raw_bool;
    }

    protected function check_int($raw_number)
    {
        return absint($raw_number);
    }

    protected function check_float($raw_float) {
        return floatval($raw_float);
    }

    public function meta()
    {
        $meta = array(
            'value' => $this->_value,
        );

        return $meta;
    }

    public function value()
    {
        return $this->_value;
    }

}
