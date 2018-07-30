<?php

/**
 * @wordpress-plugin
 * Plugin Name: Giftable for WooCommerce
 * Plugin URI:  http://decom.ba/wordpress-plugins/giftable-for-woocommerce
 * Description: Offer free gifts to your customers based on any number of easy to set up conditions (e.g. total amount and/or number of cart items on checkout).
 * Version:     1.0.2
 * Author:      Decom
 * Author URI:  http://decom.ba
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Domain Path: /languages
 * Text Domain: giftable-for-woocommerce
 *
 * Giftable for WooCommerce is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * Giftable for WooCommerce is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Giftable for WooCommerce. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define('DGFW_DOMAIN', 'giftable-for-woocommerce');
define('DGFW_PLUGIN_FILE', plugin_basename(__FILE__));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/Activator.php
 */
function activate_decom_gifts_for_woocommerce() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/Activator.php';
	DGFW_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/Deactivator.php
 */
function deactivate_decom_gifts_for_woocommerce() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/Deactivator.php';
	DGFW_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_decom_gifts_for_woocommerce' );
register_deactivation_hook( __FILE__, 'deactivate_decom_gifts_for_woocommerce' );


/**
 * Begins execution of the plugin.
 *
 * @since    0.9.0
 */
function run_decom_gifts_for_woocommerce() {

    if (is_admin()) {
        require plugin_dir_path( __FILE__ ) . 'admin/Admin.php';

        $plugin = new DGFW_Admin();
    } else {
        require plugin_dir_path( __FILE__ ) . 'public/Public.php';

        $plugin = new DGFW_Public();
    }
}
run_decom_gifts_for_woocommerce();