<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Criteria.php';
require_once 'MetaTerms.php';

/**
 * Product categories criteria class
 *
 * @since      0.9.0
 *
 */
class DGFW_CriteriaProductCategories extends DGFW_Criteria {

    private $_product_categories;

    public function __construct($conditions)
    {
        parent::__construct($conditions);

        $this->_product_categories = new DGFW_MetaTerms($conditions['terms']);
    }

    protected function check_self()
    {
        $product_category_terms = DGFW_Public::get_cart_products_terms($this->_product_categories->get_taxonomy());
        if ($product_category_terms) {
            $this->_checks_out = $this->_product_categories->check_for($product_category_terms);
        } else {
            $this->_checks_out = false;
        }
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['terms'] = $this->_product_categories->meta();
        $meta['currency'] = $this->_product_categories->currency();

        return $meta;
    }

}
