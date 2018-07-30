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

	const NAME_TEXT = 'Giftable for WooCommerce';
	const NAME_SLUG = 'giftable-for-woocommerce';
	const NAME_JSON = 'decomGiftable';
	const NAME_VARS = 'giftable_for_woocommerce';
	const TRANSLATION = 'giftable-for-woocommerce';

	const VERSION = '1.0.2';

	const GIFTS_POST_TYPE = 'dgfw_gifts';
	const GIFTS_TAXONOMY = 'dgfw_gift_categories';
	const GIFT_PRODUCT_TYPE = 'dgfw_gift';
	const GIFT_PRODUCT_OPTION = 'dgfw_giftable';
	const GIFT_VARIATION_OPTION = 'dgfw_giftable_variation';
	const GIFT_POST_STATUS = 'dgfw_internal';

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

      	// ajax hooks (admin and public)
      	add_action( 'wp_ajax_dgfw_get_giftable_variations_html', array('DGFW', 'get_giftable_variations_html'));
      	add_action( 'wp_ajax_nopriv_dgfw_get_giftable_variations_html', array('DGFW', 'get_giftable_variations_html'));

      	// these are actually used on the cart page, so they should really be
      	// in the Public version of the class, but since cart now works with
      	// ajax, and ajax works on the 'is_admin' side in WordPress, we add them here...

      	// make our giftable variables 'addable' to cart
      	add_filter( 'woocommerce_variation_is_purchasable', array($this, 'variation_is_purchasable'), 10, 2);

      	// switch internal giftable variations for appropriate real items in orders
      	// (and let WC do its thing with stock quantities and downloads, etc.)
      	// used both on admin and public side, so we put it here
      	add_filter( 'woocommerce_order_get_items', array($this, 'order_get_items'), 0, 2 );

      	// aelia currency switcher support
      	add_filter( 'wc_aelia_currencyswitcher_product_convert_callback', array($this, 'aelia_product_convert'), 10, 2 );


	}

	public function check_for_woocommerce()
	{
		// deactivate self if there's no WooCommerce
		if (!class_exists('WooCommerce')) {
			add_action( 'admin_init', array($this, 'dependency_deactivation') );
			add_action( 'admin_notices', array($this, 'dependency_deactivation_notice') );
		}
	}

	public function dependency_deactivation()
	{
		deactivate_plugins( DGFW_PLUGIN_FILE );
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

		// a custom internal post status for giftable product variations
		register_post_status(DGFW::GIFT_POST_STATUS, array(
			'public' => false,
			'internal' => true,
			'exclude_from_search' => true,
		));
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
			'suppress_filters' => false,
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
			$product_img = get_the_post_thumbnail_url($post->ID, array(90, 90));
			$products[] = array(
				'id' => $post->ID,
				'title' => $post->post_title,
				'img' => $product_img ? $product_img : wc_placeholder_img_src(array(90, 90)),
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

	public static function get_currencies()
	{
		$currencies = array();
		
		// first check for WooCommerce Multilingual currencies
		if (is_plugin_active('woocommerce_wpml') && class_exists('woocommerce_wpml') && defined('WCML_MULTI_CURRENCIES_INDEPENDENT')) {

			$woocommerce_wpml = woocommerce_wpml::instance();
			$woocommerce_wpml_settings = woocommerce_wpml::instance()->get_settings();

			if ($woocommerce_wpml_settings['enable_multi_currency'] === WCML_MULTI_CURRENCIES_INDEPENDENT) {
				$enabled_currencies = $woocommerce_wpml->multi_currency->get_currencies();
				if ($enabled_currencies) {
					$currencies[] = self::get_currency();

					foreach ($enabled_currencies as $currency => $currency_details) {
						$currencies[] = array(
							'text' => $currency,
							'symbol' => html_entity_decode(get_woocommerce_currency_symbol($currency)),
							'position' => $currency_details['position'],
						);
					}
				}
			}

			if (!empty($currencies)) {
				return $currencies;
			}
		} 

		// check for Aelia Currency Switcher
		if (class_exists('\Aelia\WC\CurrencySwitcher\WC_Aelia_CurrencySwitcher')) {

			$enabled_currencies = apply_filters('wc_aelia_cs_enabled_currencies', array());

			if (empty($enabled_currencies)) {
				return false;
			}

			$currencies = array();
			$aelia = \Aelia\WC\CurrencySwitcher\WC_Aelia_CurrencySwitcher::factory();

			foreach ($enabled_currencies as $currency) {
				$currencies[] = array(
					'text' => $currency,
					'symbol' => html_entity_decode($aelia::settings()->get_currency_symbol($currency, $currency)),
					'position' => $aelia::settings()->get_currency_symbol_position($currency),
				);
			}

			if (!empty($currencies)) {
				return $currencies;
			}
		}

		// no WooCommerce Multilingual or Aurelia
		return false;

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

	public static function get_giftable_variations_html()
	{
		$product_id = isset($_POST['product_id']) ? absint($_POST['product_id']) : false;

		$response = array(
			'data' => array(),
			'error' => false,
		);

		if ($product_id && $giftable_variations = self::get_product_giftable_variations($product_id)) {

			// with ajax, we're technically working on the 'is_admin' side,
			// but wee need the public templates and assets for this
			self::$_templates_dir = plugin_dir_path( dirname( __FILE__ ) ) . 'public/templates/';
			self::$_assets_dir = plugin_dir_path( dirname( __FILE__ ) ) . 'public/assets/';


			// we'll be using the WC product summary template, so we need to
			// set up some things first...
			// WC actions work with global $post and $product?
			global $post, $product;
			$post = get_post($product_id);
			$product = WC()->product_factory->get_product($product_id);

			// no quantities for giftable variations
			add_filter( 'woocommerce_is_sold_individually', '__return_true', 99, 2 );

			// display only giftable variations
			add_filter( 'woocommerce_get_children', array('DGFW', 'get_product_giftable_variations'), 9999, 3 );

			// modify variation attributes
			add_filter( 'woocommerce_available_variation', array('DGFW', 'modify_giftable_variation'), 99, 1);

			// make sure we get all variation data, so we don't load them
			// via ajax (that would make it much harder to filter/modify
			// our giftable variations)
			add_filter( 'woocommerce_ajax_variation_threshold', array('DGFW', 'ajax_variation_threshold'), 2 );

			// we'll make sure we're working with the default WC product summary template
			// so we don't have to worry about any custom theme variation html/css
			add_filter( 'wc_get_template_part', array('DGFW', 'giftable_variations_default_template'), 99, 3);

			$variations_html = self::get_template('giftable-variations', array('post' => get_post($product_id), 'product' => $product, 'variations' => $giftable_variations));

			// replace form tag with div, since we're appending it inside of the
			// existing cart form...
			$response['data']['html'] = str_replace('<form', '<div', $variations_html);

		}

		wp_send_json($response);
	}

	/**
	 *
	 * Filter product variations to include only giftable ones
	 *
	 */
	public static function get_product_giftable_variations($children, $product = false, $visible_only = false)
	{
		if ($product) {
			$product_is_giftable = get_post_meta($product->get_id(), '_' . DGFW::GIFT_PRODUCT_OPTION, true);
			if ($product_is_giftable !== 'yes') {
				// not all variations are giftable, get only giftable variations
				$variation_args = array(
					'post_parent' => $product->get_id(),
					'post_type' => 'product_variation',
					'meta_query' => array(
						array(
							'key' => '_' . DGFW::GIFT_VARIATION_OPTION,
							'value' => 'yes',
						)
					),
					'fields' => 'ids',
					'posts_per_page' => -1
				);


				$children = get_posts($variation_args);

			}
		}
		return $children;
	}

	/**
	 *
	 * Modify variations (set price to 0, change IDs to free versions for the cart)
	 *
	 */
	public static function modify_giftable_variation($variation)
	{
		$giftable_variation = get_posts(array(
			'post_type' => 'product_variation',
			'post_status' => DGFW::GIFT_POST_STATUS,
			'meta_key' => '_' . DGFW::GIFT_VARIATION_OPTION . '_original',
			'meta_value' => $variation['variation_id'],
			'posts_per_page' => 1
		));

		if (!empty($giftable_variation)) {
			$giftable_variation = $giftable_variation[0];
			$variation['variation_id'] = $giftable_variation->ID;
			// make sure we can add the variation to cart
			$variation['variation_is_visible'] = true;
			$variation['is_purchasable'] = true;
			$variation['availability_html'] = '';
		}


		$variation['price_html'] = '';

		return $variation;
	}

	/**
	 *
	 * Make sure we include *all* of our variation data on initial load
	 * of giftable variations on the cart page, since we can't really filter
	 * them properly if they're loaded afterwards via ajax, so it may slow it down
	 * a little if there's A LOT of variations for a gift (which should’t happen
	 * too often I think, but this way we get to use the WC add-do-cart-variation.js
	 * script for choosing between variations, instead of writing our own...)
	 *
	 */
	public static function ajax_variation_threshold($treshold)
	{
		return 999999;
	}

	/**
	 *
	 * (WC) allows only variables with post status 'publish' to be added to cart,
	 * but we have our own custom post status for giftable variations, so we
	 * need to allow that here
	 *
	 */
	public function variation_is_purchasable($purchasable, $variation)
	{
		if (get_post_status($variation->get_id()) === DGFW::GIFT_POST_STATUS) {
			$purchasable = true;
		}

		return $purchasable;
	}


	protected function is_gift($product)
	{
		$giftable = 'no';

		if ($product->get_type() === DGFW::GIFT_PRODUCT_TYPE) {
			$giftable = 'yes';
		}

		if ($product->get_type() === 'variation') {

			if (WC()->product_factory->get_product($product->get_parent_id())->get_type() === 'variable') {
				$is_giftable_product_variation = get_post_meta($product->get_id(), '_' . DGFW::GIFT_PRODUCT_OPTION, true);
				$is_giftable_variation_variation = get_post_meta($product->get_id(), '_' . DGFW::GIFT_VARIATION_OPTION . '_original', true);

				return ($is_giftable_product_variation === 'yes') || $is_giftable_variation_variation;
			} else {
				$giftable = get_post_meta($product->get_parent_id(), '_' . DGFW::GIFT_PRODUCT_OPTION, true);
			}
		}


		return $giftable === 'yes';
	}


	public function order_get_items($items, $order)
	{
		foreach ($items as $key => $item) { // loop 1

			// don't process shipping and similar items
			if (empty($item['variation_id']) && empty($item['product_id'])) {
				continue;
			}

			$product_variation_id = $item->get_variation_id() ? $item->get_variation_id() : $item->get_product_id();

			$item_product = $item->get_product();

			if ($item_product && $this->is_gift($item_product)) {

				// since we're switching giftable variations to original variations/products
				// we'll need a flag for giftable items in some filters/actions later on
				$items[$key]->update_meta_data('_is_giftable', 'yes');

				// for gift type products, no need to modify item
				if ($item_product->get_type() === DGFW::GIFTS_POST_TYPE) {
					continue; // loop 1
				}

				// for giftable variations, replace with original variation
				// we have two types of giftable variations:
				// 1. variation of a giftable variation
				// 2. variation of a giftable product
				// so check which one it is and do the appropriate replacement
				if ($item_product->get_type() === 'variation') {
					$original_variation_id = get_post_meta($item_product->get_id(), '_' . DGFW::GIFT_VARIATION_OPTION . '_original', true);

					if (!$original_variation_id) {
						$original_variation_id = '0';
					}

					$items[$key]->set_variation_id($original_variation_id);
				}
			}
		}


		return $items;
	}

	/**
	 *
	 * Always use default WC single product template for giftable variations
	 * so we don't have any problems with theme custom html/css
	 *
	 */
	public static function giftable_variations_default_template($template, $slug, $name) {
		$template_name = $slug . '-' . $name . '.php';
		return WC()->plugin_path() . '/templates/' . $template_name;
	}

	public function aelia_product_convert($callback, $product)
	{
		if ($product && $product->get_type() === DGFW::GIFT_PRODUCT_TYPE) {
			$callback = array($this, 'aelia_gift_type_convert');
		}

		return $callback;
	}

	public function aelia_gift_type_convert($product, $currency)
	{
		return $product;
	}

}
