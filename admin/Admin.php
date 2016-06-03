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
}
