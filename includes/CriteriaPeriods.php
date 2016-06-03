<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Criteria.php';
require_once 'MetaTime.php';

/**
 * Periods criteria class
 *
 * @since      0.9.0
 *
 */
class DGFW_CriteriaPeriods extends DGFW_Criteria {

    private $_start;
    private $_end;

    public function __construct($conditions)
    {
        parent::__construct($conditions);

        $this->_start = new DGFW_MetaTime($conditions['start']);
        $this->_end = new DGFW_MetaTime($conditions['end']);
    }

    protected function check_self()
    {
        $time = time();

        $this->_checks_out = $this->_start->is_before($time) && $this->_end->is_after($time);
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['start'] = $this->_start->meta();
        $meta['end'] = $this->_end->meta();

        return $meta;
    }

}
