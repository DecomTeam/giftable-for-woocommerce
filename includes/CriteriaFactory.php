<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'CriteriaEmpty.php';
require_once 'CriteriaAmounts.php';
require_once 'CriteriaItems.php';
require_once 'CriteriaProducts.php';
require_once 'CriteriaProductCategories.php';
require_once 'CriteriaUsers.php';
require_once 'CriteriaUserRoles.php';
require_once 'CriteriaPeriods.php';
// TODO require_once 'CriteriaCountries.php';

/**
 * Criteria factory class
 *
 * @since      0.9.0
 *
 */
class DGFW_CriteriaFactory {

    public static $criteria_types = array(
        'amounts' => array(
            'class' => 'DGFW_CriteriaAmounts',
        ),
        'items' => array(
            'class' => 'DGFW_CriteriaItems',
        ),
        'products' => array(
            'class' => 'DGFW_CriteriaProducts',
        ),
        'product_categories' => array(
            'class' => 'DGFW_CriteriaProductCategories',
        ),
        'users' => array(
            'class' => 'DGFW_CriteriaUsers',
        ),
        'user_roles' => array(
            'class' => 'DGFW_CriteriaUserRoles',
        ),
        // 'countries' => array(
        //     'class' => 'DGFW_CriteriaCountries',
        // ),
        'periods' => array(
            'class' => 'DGFW_CriteriaPeriods'
        ),
        'empty' => array(
            'class' => 'DGFW_CriteriaEmpty'
        ),
    );

    public static function create($criteria_meta)
    {
        $criteria_class = self::get_criteria_class($criteria_meta);

        return new $criteria_class($criteria_meta);

    }

    public static function get_criteria_class($criteria_meta)
    {
        if (
            isset($criteria_meta['type'])
            && array_key_exists($criteria_meta['type'], self::$criteria_types)
            && class_exists(self::$criteria_types[$criteria_meta['type']]['class'])
        ) {
            return self::$criteria_types[$criteria_meta['type']]['class'];
        } else {
            return self::$criteria_types['empty']['class'];
        }
    }

}
