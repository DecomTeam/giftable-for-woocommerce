<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * The admin-specific functionality of the plugin.
 *
 * @since      0.9.0
 *
 */

require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/DGFW.php';
require_once 'ScreenFactory.php';
require_once 'ScreenProducts.php';
require_once 'ScreenEditProduct.php';

class DGFW_Admin extends DGFW {

	private $_screen;

	public function __construct()
	{
		parent::__construct();

		self::$_templates_dir = plugin_dir_path( __FILE__ ) . 'templates/';
		self::$_assets_dir = plugin_dir_url( __FILE__ ) . 'assets/';
	}

	protected function define_hooks() {
		parent::define_hooks();

		add_action( 'current_screen', array($this, 'initialize_screen') );
		add_action( 'admin_enqueue_scripts', array($this, 'enqueue_scripts') );

		// Ajax hooks (screens are not initialized on ajax requests so we hook
		// all admin ajax actions as static methods here)
		add_action( 'woocommerce_product_quick_edit_save', array('DGFW_ScreenProducts', 'product_quick_edit_save'), 10, 1 );
		add_action( 'woocommerce_product_bulk_edit_save', array('DGFW_ScreenProducts', 'product_quick_edit_save'), 10, 1 );

		// add giftable option to variations
		add_action( 'woocommerce_variation_options', array('DGFW_ScreenEditProduct', 'variation_giftable_option'), 10, 3 );

		// save giftable variations
		add_action( 'woocommerce_ajax_save_product_variations', array(
			'DGFW_ScreenEditProduct', 'save_giftable_variations'), 10, 1 );

		// delete giftable variations when giftable product is deleted
		add_action( 'before_delete_post', array($this, 'delete_giftable_variations'), 10, 1);

	}

	public function initialize_screen()
	{
		$this->_screen = DGFW_ScreenFactory::create(get_current_screen());
	}

	public function enqueue_scripts() {

		wp_enqueue_style( DGFW::NAME_VARS, DGFW_Admin::style_src('admin'), array( ), DGFW::VERSION );


		wp_enqueue_script( DGFW::NAME_VARS, DGFW_Admin::script_src('admin'), array( 'jquery' ), DGFW::VERSION, true );

		wp_localize_script( DGFW::NAME_VARS, DGFW::NAME_JSON, apply_filters( 'dgfw_admin_localize_script', $this->localize_script()) );

	}

	public function localize_script()
	{
		return array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'debug' => defined('SCRIPT_DEBUG') && SCRIPT_DEBUG,
		);
	}

	/**
	 *
	 * Delete giftable variations when a product is deleted
	 *
	 */
	public function delete_giftable_variations($post_id)
	{
		$product = WC()->product_factory->get_product($post_id);

		if ($product) {

			$variation_args = array(
				'post_type' => 'product_variation',
				'post_parent' => $product->get_parent_id(),
				'post_status' => DGFW::GIFT_POST_STATUS,
				'posts_per_page' => -1,
				'fields' => 'ids',
				'meta_query' => array(),
			);

			// variations
			if ($product->get_type() === 'variation') {

				$variation_args['meta_query'][] = array(
					'key' => '_' . DGFW::GIFT_VARIATION_OPTION . '_original',
					'value' => $product->get_id(),
				);

			}

			$variations = get_posts($variation_args);

			foreach ($variations as $variation_id) {
				wp_delete_post($variation_id);
			}

		}
	}


}
