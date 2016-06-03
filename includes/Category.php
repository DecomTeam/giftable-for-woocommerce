<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'CriteriaFactory.php';

/**
 * Category abstract class
 *
 * @since      0.9.0
 *
 */
abstract class DGFW_Category {

    protected $_term;
    protected $_criteria;
    protected $_gifts;
    protected $_gifts_allowed;
    protected $_enabled;

    public function __construct($term)
    {
        $this->_term = $term;
        $this->load_enabled();
        $this->load_gifts_allowed();
        $this->load_criteria();
    }

    protected function load_enabled()
    {
        $this->_enabled = (bool)get_term_meta($this->_term->term_id, '_dgfw_enabled', true);
    }

    protected function load_gifts_allowed()
    {
        $this->_gifts_allowed = get_term_meta($this->_term->term_id, '_dgfw_gifts_allowed', true);
    }

    protected function load_criteria()
    {
        $criteria_meta = get_term_meta($this->_term->term_id, '_dgfw_criteria', true);

        $this->_criteria = DGFW_CriteriaFactory::create($criteria_meta);
    }

    public function criteria()
    {
        return $this->_criteria;
    }

    public function number_of_gifts_allowed()
    {
        return $this->_gifts_allowed;
    }

    public function is_relevant()
    {
        return ($this->_enabled && $this->_criteria) ? $this->_criteria->check_conditions() : false;
    }

    public function id()
    {
        return $this->_term->term_id;
    }

    public function name()
    {
        return $this->_term->name;
    }

    public function description()
    {
        return __('No conditions added for this gift category yet.', DGFW::TRANSLATION);
    }

}
