<?php


if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/DGFW.php';
require_once 'CategoryPublic.php';
// require_once 'GiftPublic.php';


/**
 * Public plugin class
 *
 * @since      0.9.0
 *
 */
class DGFW_Public extends DGFW {

	private $_load = false;

	private static $_cart = array();

	private $_available_gifts = array();

	private $_chosen_gifts = array();


	public function __construct()
	{
		parent::__construct();

		self::$_templates_dir = plugin_dir_path( __FILE__ ) . 'templates/';
		self::$_assets_dir = plugin_dir_url( __FILE__ ) . 'assets/';
	}

	protected function define_hooks() {
		parent::define_hooks();
		add_action( 'wp', array($this, 'process_cart') );
		add_action( 'wp_enqueue_scripts', array($this, 'enqueue_scripts'), 99 );
		add_action( 'woocommerce_before_cart_table', array($this, 'display_available_gifts') );

		// product hooks
		add_filter( 'woocommerce_product_tabs', array($this, 'check_gift_tabs'), 9999, 1 );
	}

	private function add_cart_filters()
	{

		// Cart item filters for gifts
		add_filter( 'woocommerce_cart_product_price', array($this, 'gift_cart_price'), 9999, 2 );
		add_filter( 'woocommerce_cart_product_subtotal', array($this, 'gift_cart_price'), 9999, 2 );
		add_filter( 'woocommerce_get_item_data', array($this, 'gift_cart_data'), 9999, 2 );
		add_filter( 'woocommerce_cart_item_name', array($this, 'gift_cart_title'), 9999, 3 );
	}

	public function enqueue_scripts() {
		if (is_cart()) {
			wp_enqueue_style( DGFW::NAME_VARS, DGFW_Public::style_src('public'), array(), DGFW::VERSION );


			wp_enqueue_script( DGFW::NAME_VARS . '_slick', DGFW_Public::script_src('slick/slick'), array( 'jquery' ), DGFW::VERSION, false );
			wp_enqueue_script( DGFW::NAME_VARS, DGFW_Public::script_src('public'), array( DGFW::NAME_VARS . '_slick', 'jquery' ), DGFW::VERSION, false );
			wp_localize_script( DGFW::NAME_VARS, DGFW::NAME_JSON,
					array(
						'ajaxUrl' => admin_url( 'admin-ajax.php' ),
						'security' => wp_create_nonce( DGFW::NAME_VARS . '_secure' )
						)
					);
		}
	}

	public function process_cart()
	{
		if (!is_cart() || (WC_Admin_Settings::get_option('woocommerce_dgfw_enable_gifts', 'yes') !== 'yes')) {
			return;
		}

		$this->_load = true;

		$this->add_cart_filters();
		$this->process_request();
		$this->analyze_cart_contents();
		$this->load_available_gifts();
	}

	private function is_gift($product)
	{
		$giftable = 'no';

		if ($product->get_type() === DGFW::GIFT_PRODUCT_TYPE) {
			$giftable = 'yes';
		}

		if ($product->get_type() === 'variation') {
			$giftable = get_post_meta($product->id, '_' . DGFW::GIFT_PRODUCT_OPTION, true);
		}

		return $giftable === 'yes';
	}

	private function analyze_cart_contents()
	{
		$cart_contents = WC()->cart->cart_contents;

		self::$_cart = array(
			'product' => array(
				'count' => 0,
				'items' => array(),
				'ids' => array(),
				'terms' => array()
			),
			'gift' => array(
				'count' => 0,
				'gift_categories' => array(),
				'items' => array(),
				'ids' => array(),
			),
		);

		foreach ($cart_contents as $key => $item) {
			if ($this->is_gift($item['data'])) {
				$item_type = 'gift';
				if ($gift_categories = get_the_terms($item['data']->id, DGFW::GIFTS_TAXONOMY)) {
					foreach ($gift_categories as $gift_category) {
						if (!isset(self::$_cart[$item_type]['gift_categories'][$gift_category->term_id])) {
							self::$_cart[$item_type]['gift_categories'][$gift_category->term_id]['count'] = 1;
						} else {
							self::$_cart[$item_type]['gift_categories'][$gift_category->term_id]['count']++;
						}
					}
				}
			} else {
				$item_type = 'product';
				foreach (DGFW::get_relevant_product_taxonomies() as $taxonomy) {
					if ($terms = get_the_terms( $item['product_id'], $taxonomy )) {
						foreach ($terms as $term){
							if (!isset(self::$_cart[$item_type]['terms'][$taxonomy][$term->term_id])) {
								self::$_cart[$item_type]['terms'][$taxonomy][$term->term_id]['count'] = 1;
								self::$_cart[$item_type]['terms'][$taxonomy][$term->term_id]['quantity'] = $item['quantity'];
								self::$_cart[$item_type]['terms'][$taxonomy][$term->term_id]['amount'] = $item['line_subtotal'] + $item['line_subtotal_tax'];
							} else {
								self::$_cart[$item_type]['terms'][$taxonomy][$term->term_id]['count']++;
								self::$_cart[$item_type]['terms'][$taxonomy][$term->term_id]['quantity'] += $item['quantity'];
								self::$_cart[$item_type]['terms'][$taxonomy][$term->term_id]['amount'] += $item['line_subtotal'] + $item['line_subtotal_tax'];
							}
						}
					}
				}
			}
			self::$_cart[$item_type]['count']+= $item['quantity'];
			self::$_cart[$item_type]['items'][$key] = $item['data'];
			self::$_cart[$item_type]['ids'][$item['data']->id] = $item['quantity'];
		}

		if ($this->number_of_gifts_chosen() > 0) {
			$this->validate_gifts();
		}

	}

	/**
	 *
	 * Check if chosen gifts are still valid after cart update
	 *
	 */
	private function validate_gifts()
	{
		$valid = true;

		foreach (self::$_cart['gift']['items'] as $cart_key => $gift ) {
			if (!$this->is_gift_valid($gift)) {
				WC()->cart->remove_cart_item($cart_key);
				wc_add_notice( __( 'Some gifts have been removed from your cart.', DGFW::TRANSLATION ) );
				$valid = false;
			}
		}

		if (!$valid) {
			// we need to analyze cart contents again
			$this->analyze_cart_contents();
		}
	}


	/**
	 *
	 * Check if chosen gift is still valid
	 *
	 */
	private function is_gift_valid($gift)
	{
		$gift_categories = get_the_terms($gift->id, DGFW::GIFTS_TAXONOMY);

		// cart gift is valid if any of its gift categories' conditions are still met
		foreach ($gift_categories as $gtc) {
			$gift_category = new DGFW_CategoryPublic($gtc);
			if (($gift_category->number_of_gifts_allowed() >= $this->number_of_gifts_chosen($gtc->term_id)) && $gift_category->is_relevant() ) {
				return true;
			}
		}

		return false;
	}


	/**
	 *
	 * Check if potential gift is availble to offer
	 *
	 */
	private function is_gift_available($gift)
	{
		// check if gift item is in stock
		if (!$gift->is_in_stock()) {
			return false;
		}
		// for giftable variations, check parent stock status
		if (($gift->get_type() !== DGFW::GIFT_PRODUCT_TYPE) && !($gift->parent->is_in_stock())) {
			return false;
		}

		// if gift is already added to cart
		if (array_key_exists($gift->id, self::$_cart['gift']['ids'])) {
			return false;
		}

		// check all gift categories for number of gifts allowed
		$gift_categories = get_the_terms($gift->id, DGFW::GIFTS_TAXONOMY);

		foreach ($gift_categories as $gtc) {
			$gift_category = new DGFW_CategoryPublic($gtc);
			if (($gift_category->number_of_gifts_allowed() <= $this->number_of_gifts_chosen($gtc->term_id))) {
				return false;
			}
		}

		return true;
	}


	/**
	 *
	 * Add gift to cart if requested
	 *
	 */
	private function process_request()
	{
		if (isset($_POST['dgfw_chosen_gift']) && ($product_id = absint($_POST['dgfw_chosen_gift']))) {
			if ($giftable = get_post_meta($product_id, '_' . DGFW::GIFT_PRODUCT_OPTION, true)) {
				$product = WC()->product_factory->get_product($product_id);

				// if product type is not gift, get the free gift product variation
				if ($product->get_type() !== DGFW::GIFT_PRODUCT_TYPE) {
					$gift_variation_id = $product_id;
				} else {
					$gift_variation_id = 0;
				}

				WC()->cart->add_to_cart($product->id, 1, $gift_variation_id);
				wc_add_notice( __( 'Your free gift has been added.', DGFW::TRANSLATION ) );
			}
		}
	}

	/**
	 *
	 * Get cart product count
	 *
	 */
	public static function get_cart_product_count()
	{
		return self::$_cart['product']['count'];
	}

	public static function get_cart_products_terms($taxonomy = false)
	{
		if ($taxonomy) {
			return isset(self::$_cart['product']['terms'][$taxonomy]) ? self::$_cart['product']['terms'][$taxonomy] : false;
		}

		return self::$_cart['product']['terms'];
	}

	/**
	 *
	 * Cart product ids
	 *
	 */
	public static function get_cart_products()
	{
		return self::$_cart['product']['ids'];
	}



	/**
	 *
	 * Get available gifts
	 *
	 */
	public function load_available_gifts()
	{
		$gift_category_terms = get_terms(DGFW::GIFTS_TAXONOMY);

		foreach ( $gift_category_terms as $gct ) {
			$gift_category = new DGFW_CategoryPublic($gct);
			if (($gift_category->number_of_gifts_allowed() > $this->number_of_gifts_chosen($gct->term_id)) && $gift_category->is_relevant() ) {
				$this->_available_gifts = array_merge($this->_available_gifts, $gift_category->get_gifts());
			}
		}

		// remove any gifts already chosen or otherwise unavailable
		foreach ($this->_available_gifts as $gift_key => $gift) {
			if (!($this->is_gift_available($gift))) {
				unset($this->_available_gifts[$gift_key]);
			}
		}

		if (empty($this->_available_gifts)) {
			$this->_load = false;
		}
	}

	/**
	 *
	 * Display available gifts selection
	 *
	 */
	public function display_available_gifts()
	{
		if (!$this->_load) {
			return false;
		}

		$template_vars = array();

		$template_vars['available_gifts'] = $this->_available_gifts;
		self::print_template('available-gifts', $template_vars);
	}


	public function number_of_gifts_chosen($gift_category_id = false)
	{
		if ($gift_category_id) {
			if (isset(self::$_cart['gift']['gift_categories'][$gift_category_id])) {
				return self::$_cart['gift']['gift_categories'][$gift_category_id]['count'];
			} else {
				return 0;
			}
		}

		return self::$_cart['gift']['count'];

	}

	public function gift_cart_price($price, $_product)
	{
		if ($this->is_gift($_product)) {
			return __('FREE!', DGFW::TRANSLATION);
		}

		return $price;
	}

	public function gift_cart_data($item_data, $cart_item)
	{

		if ($this->is_gift($cart_item['data'])) {
			$item_data[] = array(
				'key' => __('Gift', DGFW::TRANSLATION),
				'value' => __('Free gift...', DGFW::TRANSLATION)
			);
		}

		return $item_data;
	}

	public function gift_cart_title($title, $cart_item, $cart_item_key)
	{
		if ($this->is_gift($cart_item['data'])) {
			$title = sprintf( '<a href="%s">%s</a>', esc_url( $cart_item['data']->get_permalink( $cart_item ) ), $cart_item['data']->get_title() );
		}

		return $title;
	}

	public function check_gift_tabs($tabs)
	{
		global $post;
		$product = WC()->product_factory->get_product($post->ID);

		if ($this->is_gift($product)) {
			$gift_tabs = get_post_meta($post->ID, '_dgfw_gift_tabs', true);

			if ($gift_tabs !== 'yes') {
				return array();
			}
		}

		return $tabs;
	}

}
