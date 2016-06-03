<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Meta.php';


/**
 * Users meta class
 *
 * @since      0.9.0
 *
 */
class DGFW_MetaUsers extends DGFW_Meta {

    private $_include;

    public function __construct($raw_meta)
    {
        parent::__construct($raw_meta, 'string');

        // TODO add include/exclude option
        $this->_include = true;
    }

    public function check_for($user_id)
    {
        $includes = in_array($user_id, explode(',', $this->_value));

        return $this->_include ? $includes : !$includes;
    }
}
