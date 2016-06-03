<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Meta.php';


/**
 * Time meta class
 *
 * @since      0.9.0
 *
 */
class DGFW_MetaTime extends DGFW_Meta {

    public function __construct($raw_meta)
    {
        parent::__construct($raw_meta, 'array');
    }

    public function is_before($time)
    {
        return $this->time() < $time;
    }

    public function is_after($time)
    {
        return $this->time() > $time;
    }

    public function is_equal($time)
    {
        return $this->time() == $time;
    }

    public function time()
    {
        return strtotime($this->_value['date'] . ' ' . $this->_value['time']);
    }

}
