<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Meta.php';
require_once 'MetaQuantity.php';
require_once 'MetaCurrency.php';


/**
 * Terms meta class
 *
 * @since      0.9.0
 *
 */
class DGFW_MetaTerms extends DGFW_Meta {

    private $_taxonomy;
    private $_include;
    private $_any;

    public function __construct($raw_meta)
    {
        parent::__construct($raw_meta, 'array');

        $this->_taxonomy = $this->check_string($raw_meta['taxonomy']);
        // TODO add include/exclude and any/all options
        $this->_include = true;
        $this->_any = true;
    }

    public function check_for($products_terms)
    {
        $includes = $this->_any ? $this->check_for_any($products_terms) : $this->check_for_all($products_terms);

        return $this->_include ? $includes : !$includes;
    }

    private function check_for_any($products_terms)
    {
        foreach ($products_terms as $term_id => $term_data) {
            if (in_array($term_id, $this->_value)) {
                return true;
            }
        }

        return false;
    }

    private function check_for_all($products_terms)
    {
        foreach ($products_terms as $term_id => $term_data) {
            if (!(in_array($term, $this->_value) && $this->check_quantity($term_data['quantity']) && $this->check_amount($term_data['amount']))) {
                return false;
            }
        }

        return true;
    }

    private function check_quantity($quantity)
    {
        // TODO implement in future releases
        return true;
    }

    private function check_amount($amount)
    {
        // TODO implement in future releases
        return true;
    }

    public function get_taxonomy()
    {
        return $this->_taxonomy;
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['taxonomy'] = $this->_taxonomy;

        return $meta;
    }

}
