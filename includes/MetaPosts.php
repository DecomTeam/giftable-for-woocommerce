<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}


require_once 'Meta.php';
require_once 'MetaQuantity.php';

/**
 * Posts meta class
 *
 * @since      0.9.0
 *
 */
class DGFW_MetaPosts extends DGFW_Meta {

    private $_post_types;
    private $_include;
    private $_any;

    public function __construct($raw_meta)
    {
        parent::__construct($raw_meta, 'array');

        $this->_post_types = $this->check_array($raw_meta['post_types']);
        // TODO add include/exclude and any/all options
        $this->_include = true;
        $this->_any = true;
    }

    public function check_for($products_ids)
    {
        $includes = $this->_any ? $this->check_for_any($products_ids) : $this->check_for_all($products_ids);

        return $this->_include ? $includes : !$includes;
    }

    private function check_for_any($products_ids)
    {
        foreach ($this->_value as $product_id => $product_data) {
            if (array_key_exists($product_id, $products_ids) && ($products_ids[$product_id] >= $this->_value[$product_id]['min_items'])) {
                return true;
            }
        }

        return false;
    }

    private function check_for_all($products_ids)
    {
        foreach ($this->_value as $product_id => $product_data) {
            if (!(array_key_exists($product_id, $products_ids) && ($products_ids[$product_id] >= $this->_value[$product_id]['min_items']))) {
                return false;
            }
        }

        return true;
    }

    private function check_quantity($quantity)
    {
        return true;
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['post_types'] = $this->_post_types;

        return $meta;
    }

}
