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
    private $_min_amounts;
    private $_min_items;
    private $_include;
    private $_any;

    public function __construct($raw_meta)
    {
        // make sure we have an empty value array if there is none
        if (!isset($raw_meta['value'])) {
            $raw_meta['value'] = array();
        }

        parent::__construct($raw_meta, 'array');

        $this->_taxonomy = $this->check_string($raw_meta['taxonomy']);

        // parse min amounts and min items
        $this->_min_amounts = array();
        $this->_min_items = array();

        foreach ($this->_value as $term_id) {
            if (isset($raw_meta['min_amounts'][$term_id])) {
                $this->_min_amounts[$term_id] = new DGFW_MetaCurrency($raw_meta['min_amounts'][$term_id]);
            }
            if (isset($raw_meta['min_items'][$term_id])) {
                $this->_min_items[$term_id] = new DGFW_MetaQuantity($raw_meta['min_items'][$term_id]);
            }
        }

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
            if (in_array($term_id, $this->_value) && $this->check_quantity($term_id, $term_data['quantity']) && $this->check_amount($term_id, $term_data['amount'])) {
                return true;
            }
        }

        return false;
    }

    private function check_for_all($products_terms)
    {
        foreach ($products_terms as $term_id => $term_data) {
            if (!(in_array($term, $this->_value) && $this->check_quantity($term_id, $term_data['quantity']) && $this->check_amount($term_id, $term_data['amount']))) {
                return false;
            }
        }

        return true;
    }

    private function check_quantity($term_id, $quantity)
    {
        if (isset($this->_min_items[$term_id])) {
            return $this->_min_items[$term_id]->is_lte($quantity);
        }

        // backward compatibility, there was no quantity per category field...
        return true;
    }

    private function check_amount($term_id, $amount)
    {
        if (isset($this->_min_amounts[$term_id])) {
            return $this->_min_amounts[$term_id]->is_lte($amount);
        }

        // backward compatibility, there was no amount per category field...
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

        $meta['min_amounts'] = array();
        $meta['min_items'] = array();

        foreach ($this->_value as $term_id) {
            if (isset($this->_min_amounts[$term_id])) {
                $meta['min_amounts'][$term_id] = $this->_min_amounts[$term_id]->meta();
            }
            if (isset($this->_min_items[$term_id])) {
                $meta['min_items'][$term_id] = $this->_min_items[$term_id]->meta();
            }
        }

        return $meta;
    }

    public function currency()
    {
        $currency = false;

        if (count($this->_min_amounts)) {
            // get first term currency, since all are same
            $currency = reset($this->_min_amounts)->currency();
        }

        return $currency;
    }

}
