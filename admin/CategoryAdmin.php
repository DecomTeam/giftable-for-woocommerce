<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * Gift category class
 *
 * @since      0.9.0
 *
 */

require_once plugin_dir_path( dirname(__FILE__) ) . 'includes/Category.php';
require_once plugin_dir_path( dirname(__FILE__) ) . 'includes/CriteriaEmpty.php';

class DGFW_CategoryAdmin extends DGFW_Category {


    public function parse_criteria($raw_criteria)
    {
        foreach ($raw_criteria as $criteria_meta) {
            $this->_criteria = DGFW_CriteriaFactory::create($criteria_meta);
        }
    }

    public function save_criteria()
    {
        update_term_meta($this->_term->term_id, '_dgfw_criteria', $this->_criteria->meta());
    }

    public function delete_criteria()
    {
        $this->_criteria = new DGFW_CriteriaEmpty();
        delete_term_meta($this->_term->term_id, '_dgfw_criteria');
    }

    public function save_number_of_gifts_allowed($gifts_allowed)
    {
        update_term_meta($this->_term->term_id, '_dgfw_gifts_allowed', $gifts_allowed);
    }

    public function save_enabled($enabled)
    {
        update_term_meta($this->_term->term_id, '_dgfw_enabled', $enabled);
    }

}
