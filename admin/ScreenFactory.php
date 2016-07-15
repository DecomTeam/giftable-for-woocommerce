<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'ScreenEmpty.php';
require_once 'ScreenEditCategory.php';
require_once 'ScreenProducts.php';
require_once 'ScreenEditGift.php';
require_once 'ScreenEditProduct.php';
require_once 'ScreenSettings.php';
require_once 'ScreenShopOrder.php';


/**
 * Screen factory class
 *
 * @since      0.9.0
 *
 */

class DGFW_ScreenFactory {

    public static $screens = array(
        'edit-dgfw_gift_categories' => array(
            'class' => 'DGFW_ScreenEditCategory',
        ),
        'edit-product' => array(
            'class' => 'DGFW_ScreenProducts',
        ),
        'product' => array(
            'class' => 'DGFW_ScreenEditProduct',
        ),
        'empty' => array(
            'class' => 'DGFW_ScreenEmpty',
        ),
        'woocommerce_page_wc-settings' => array(
            'class' => 'DGFW_ScreenSettings',
        ),
        'shop_order' => array(
            'class' => 'DGFW_ScreenShopOrder',
        ),
    );

    public static function create($screen)
    {
        $screen_class = self::get_screen_class($screen);

        return $screen_class ? new $screen_class($screen) : false;

    }

    public static function get_screen_class($screen)
    {
        if (
            isset($screen->id)
            && array_key_exists($screen->id, self::$screens)
            && class_exists(self::$screens[$screen->id]['class'])
        ) {
            return self::$screens[$screen->id]['class'];
        } else {
            return self::$screens['empty']['class'];
        }
    }

}
