<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * Main plugin class, extended by DGFW_Admin and DGFW_Public
 *
 * @since      0.9.0
 *
 */
abstract class DGFW {

	const NAME_TEXT = 'Decom Gifts for WooCommerce';
	const NAME_SLUG = 'giftable-for-woocommerce';
	const NAME_JSON = 'decomGifts';
	const NAME_VARS = 'giftable_for_woocommerce';
	const TRANSLATION = 'giftable-for-woocommerce';

	const VERSION = '0.9.0';

	const GIFTS_POST_TYPE = 'dgfw_gifts';
	const GIFTS_TAXONOMY = 'dgfw_gift_categories';
	const GIFT_PRODUCT_TYPE = 'dgfw_gift';
	const GIFT_PRODUCT_OPTION = 'dgfw_giftable';

	protected static $_templates_dir;
	protected static $_assets_dir;

	public function __construct() {
		$this->define_hooks();
	}

	protected function define_hooks() {
		add_action( 'init', array($this, 'check_for_woocommerce'), 0 );
		add_action( 'plugins_loaded', array($this, 'load_plugin_textdomain') );
		add_action( 'init', array($this, 'register_post_types_and_taxonomies'), 10 );

		// WooCommerce needs our product type class in various places, but only
		// after init...
        add_action( 'init', array($this, 'require_product_type_class'), 10);

	}

	public function check_for_woocommerce()
	{
		// deactivate self if there's no WooCommerce
		if (!class_exists('WooCommerce')) {
			add_action( 'admin_notices', array($this, 'dependency_deactivation_notice') );
			deactivate_plugins( DGFW_PLUGIN_FILE );
		}
	}

	public function dependency_deactivation_notice()
	{
		echo '<div class="updated"><p>';
		_e('<strong>Giftable for WooCommerce</strong> can‘t work without WooCommerce; the plug-in has been <strong>deactivated</strong>', DGFW::TRANSLATION);
		echo '.</p></div>';
		if ( isset( $_GET['activate'] ) )
			unset( $_GET['activate'] );
	}

	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			DGFW::TRANSLATION,
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}

	public function register_post_types_and_taxonomies()
	{
		$taxonomies = array(
            DGFW::GIFTS_TAXONOMY => array(
            	'post_type' => 'product',
                'labels' => array(
                    'name'              => _x( 'Gift categories', 'taxonomy general name', DGFW::TRANSLATION ),
                    'singular_name'     => _x( 'Gift category', 'taxonomy singular name', DGFW::TRANSLATION ),
                    'search_items'      => __( 'Search Gift categories', DGFW::TRANSLATION ),
                    'all_items'         => __( 'All Gift categories', DGFW::TRANSLATION ),
                    'parent_item'       => __( 'Parent Gift category', DGFW::TRANSLATION ),
                    'parent_item_colon' => __( 'Parent Gift category:', DGFW::TRANSLATION ),
                    'edit_item'         => __( 'Edit Gift category', DGFW::TRANSLATION ),
                    'update_item'       => __( 'Update Gift category', DGFW::TRANSLATION ),
                    'add_new_item'      => __( 'Add New Gift category', DGFW::TRANSLATION ),
                    'new_item_name'     => __( 'New Gift category Name', DGFW::TRANSLATION ),
                    'menu_name'         => __( 'Gift categories', DGFW::TRANSLATION ),
                ),
				'public'			=> false,
                'hierarchical'      => false,
                'show_ui'           => true,
                'show_admin_column' => true,
                'query_var'         => true,
                'rewrite'           => array( 'slug' => __('gifts', DGFW::TRANSLATION) ),
            ),
        );

		foreach ($taxonomies as $taxonomy_name => $taxonomy_args) {
			register_taxonomy($taxonomy_name, $taxonomy_args['post_type'], $taxonomy_args);
		}
	}

	/**
	 *
	 * Require Gift product type class (we need to do this on init to extend
	 * WC class unavailable before)
	 *
	 */
	public function require_product_type_class()
	{
	    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/Product_Gift.php';
	}


	public static function get_relevant_product_taxonomies()
	{
		return array('product_cat');
	}

	public static function print_template($template_file, $template_vars = array())
	{
		if (is_array($template_vars)) {
			extract($template_vars);
		}

		include self::template_src($template_file);
	}

	public static function get_template($template_file, $template_vars = array())
	{
		ob_start();
		self::print_template($template_file, $template_vars);
		$output = ob_get_clean();

		return $output;
	}

	public static function template_src($template_file)
	{
		$ext = '.php';
		return self::$_templates_dir . $template_file . $ext;
	}

	public static function script_src($script_file)
	{
		$ext = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '.js' : '.min.js';
		return self::$_assets_dir . 'js/' . $script_file . $ext;
	}

	public static function style_src($style_file)
	{
		$ext = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '.css' : '.min.css';
		return self::$_assets_dir . 'css/' . $style_file . $ext;
	}

	public static function image_src($image_file)
	{
		return self::$_assets_dir . 'images/' . $image_file;
	}

	public static function get_products($product_cats = false, $limit = 5, $offset = 0)
	{
		$args = array(
			'post_type' => 'product',
			'posts_per_page' => $limit,
			'offset' => $offset,
			'tax_query' => array(
				array(
					'taxonomy' => 'product_type',
					'field' => 'name',
					'terms' => DGFW::GIFT_PRODUCT_TYPE,
					'operator' => 'NOT IN',
				),
			),
			'orderby' => 'title',
			'order' => 'ASC',
		);

		if (!empty($product_cat)) {
			$args['tax_query']['relation'] = 'AND';
			$args['tax_query'][] = array(
				'taxonomy' => 'product_cat',
				'field'    => 'term_id',
				'terms'    => $product_cats,
			);
		}

		$posts = get_posts($args);
		$products = array();

		foreach ($posts as $post) {
			$products[] = array(
				'id' => $post->ID,
				'title' => $post->post_title,
				'img' => get_the_post_thumbnail_url($post->ID, array(90, 90)),
			);
		}

		return $products;
	}

	public static function get_roles()
	{
		$roles = array();

		foreach (wp_roles()->role_names as $name => $title) {
			$roles[] = array(
				'name' => $name,
				'title' => $title
			);
		}

		return $roles;
	}

	public static function get_product_cats()
	{
		$terms = array();

		foreach (get_terms('product_cat') as $term) {
			$terms[] = array(
				'id' => $term->term_id,
				'title' => $term->name,
				'name' => $term->slug,
			);
		}

		return $terms;
	}

	public static function get_users($role = false, $limit = 5, $offset = 0)
	{
		$args = array(
			'number' => $limit,
			'offset' => $offset,
			);

		if (!empty($role)) {
			$args['role'] = $role;
		}

		$wp_users = get_users($args);
		$users = array();

		foreach ($wp_users as $user) {
			$users[] = array(
				'id' => $user->ID,
				'displayName' => $user->data->display_name,
				'img' => get_avatar_url($user->ID, array(90, 90)),
			);
		}

		return $users;
	}

	public static function get_currency()
	{
		return array(
			'text' => get_woocommerce_currency(),
			'symbol' => html_entity_decode(get_woocommerce_currency_symbol()),
			'position' => get_option('woocommerce_currency_pos'),
		);
	}

	public static function gift_categories($hide_empty = false)
	{
		$terms = array();

		foreach (get_terms(DGFW::GIFTS_TAXONOMY, array('hide_empty' => $hide_empty)) as $term) {
			$terms[] = array(
				'id' => $term->term_id,
				'title' => $term->name,
				'name' => $term->slug,
			);
		}

		return $terms;
	}

}
