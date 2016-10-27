<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'CriteriaFactory.php';
require_once 'CriteriaEmpty.php';


/**
 * Criteria abstract class
 *
 * @since      0.9.0
 *
 */
abstract class DGFW_Criteria {

    protected $_id;
    protected $_subcriteria;
    protected $_type;
    protected $_logic;
    protected $_checks_out;
    protected $_template;

    public function __construct($conditions)
    {
        $this->_id = $conditions['id'];
        $this->_logic = isset($conditions['logic']) ? $conditions['logic'] : false;
        $this->_type = $conditions['type'];

        $this->_subcriteria = array();
        if (isset($conditions['subcriteria']) && is_array($conditions['subcriteria'])) {
            foreach ($conditions['subcriteria'] as $criteria_meta) {
                $this->_subcriteria[] = DGFW_CriteriaFactory::create($criteria_meta);
            }
        } else {
            $this->_subcriteria[] = new DGFW_CriteriaEmpty();
        }

        $this->_template = 'category-criteria';
    }

    public function check_conditions()
    {
        $this->check_self();

        foreach ($this->_subcriteria as $subcriteria) {
            $this->check_with($subcriteria);
        }

        return $this->_checks_out;
    }

    protected function check_with($subcriteria)
    {
        if ($subcriteria->is_and()) {
            $this->_checks_out = $this->_checks_out && $subcriteria->check_conditions();
        } else {
            $this->_checks_out = $this->_checks_out || $subcriteria->check_conditions();
        }
    }

    public function is_and()
    {
        return $this->_logic === 'AND';
    }

    abstract protected function check_self();

    public function template()
    {
        DGFW_Admin::print_template($this->_template);
    }

    public function meta()
    {
        $meta = array(
            'id' => $this->_id,
            'type' => $this->_type,
            'logic' => $this->_logic,
        );

        foreach ($this->_subcriteria as $subcriteria) {
            if ($subcriteria_meta = $subcriteria->meta()) {
                $meta['subcriteria'][] = $subcriteria_meta;
            }
        }

        return $meta;
    }
}
