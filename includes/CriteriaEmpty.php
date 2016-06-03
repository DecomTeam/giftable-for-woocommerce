<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Criteria.php';

/**
 * Empty criteria class
 *
 * @since      0.9.0
 *
 */

class DGFW_CriteriaEmpty extends DGFW_Criteria {

    public function __construct()
    {
        $this->_template = 'criteria-empty';
    }

    public function check_conditions()
    {
        return false;
    }

    public function is_and()
    {
        return false;
    }

    public function check_self()
    {
        return false;
    }

    public function meta()
    {
        return false;
    }
}
