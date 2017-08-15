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

	/**
	 *
	 * Filters run on public side (all pages)
	 *
	 */
	protected function define_hooks() {
		parent::define_hooks();
		add_action( 'wp', array($this, 'process_cart') );
		add_action( 'wp_enqueue_scripts', array($this, 'enqueue_scripts'), 99 );
		add_action( 'woocommerce_before_cart_table', array($this, 'display_available_gifts') );

		// product hooks
		add_filter( 'woocommerce_product_tabs', array($this, 'check_gift_tabs'), 9999, 1 );

		// modify add to cart message for variations added on the cart page
		add_filter( 'wc_add_to_cart_message_html', array($this, 'add_to_cart_message'), 99, 2 );
	}

	/**
	 *
	 * Filters run only on the cart page
	 *
	 */
	private function add_cart_filters()
	{
		// Cart item filters for gifts
		add_filter( 'woocommerce_cart_product_price', array($this, 'gift_cart_price'), 9999, 2 );
		add_filter( 'woocommerce_cart_product_variation_price', array($this, 'gift_cart_price'), 9999, 2 );
		add_filter( 'woocommerce_cart_product_subtotal', array($this, 'gift_cart_price'), 9999, 2 );
		add_filter( 'woocommerce_cart_product_variation_subtotal', array($this, 'gift_cart_price'), 9999, 2 );
		add_filter( 'woocommerce_get_item_data', array($this, 'gift_cart_data'), 9999, 2 );
		add_filter( 'woocommerce_cart_item_name', array($this, 'gift_cart_title'), 9999, 3 );
		// modify giftable variations cart data (use original variation images, etc)
		add_filter( 'woocommerce_cart_item_thumbnail', array($this, 'gift_cart_thumbnail'), 10, 3);
		add_filter( 'woocommerce_is_sold_individually', array($this, 'gift_cart_sold_individually'), 99, 2 );

	}

	public function enqueue_scripts() {
		if (is_cart() && (WC_Admin_Settings::get_option('woocommerce_dgfw_enable_gifts', 'yes') === 'yes')) {
			wp_enqueue_style( DGFW::NAME_VARS, DGFW_Public::style_src('public'), array(), DGFW::VERSION );


			wp_enqueue_script( DGFW::NAME_VARS . '_slick', DGFW_Public::script_src('slick/slick'), array( 'jquery' ), DGFW::VERSION, false );
			wp_enqueue_script( DGFW::NAME_VARS, DGFW_Public::script_src('public'), array( DGFW::NAME_VARS . '_slick', 'jquery', 'wc-add-to-cart-variation' ), DGFW::VERSION, false );
			wp_localize_script( DGFW::NAME_VARS, DGFW::NAME_JSON,
				array(
					'ajaxUrl' => admin_url( 'admin-ajax.php' ),
					'security' => wp_create_nonce( DGFW::NAME_VARS . '_secure' ),
					'carouselSlides' => array(
						'large' => WC_Admin_Settings::get_option('woocommerce_dgfw_carousel_gifts_large', 4),
						'medium' => WC_Admin_Settings::get_option('woocommerce_dgfw_carousel_gifts_medium', 3),
						'small' => WC_Admin_Settings::get_option('woocommerce_dgfw_carousel_gifts_small', 1),
					),
				)
			);
		}
	}

	public function process_cart()
	{
		if (WC_Admin_Settings::get_option('woocommerce_dgfw_enable_gifts', 'yes') !== 'yes') {
			// plugin functionality disabled, do nothing
			return;
		}

		// gift display filters, added to all pages to make sure gifts in the
		// mini-cart and the cart page always display properly
		$this->add_cart_filters();

		if (!is_cart()) {
			// not the cart page, so add only minimum functionality/processing
			// to ensure gifts are re-validated if products are added/removed
			// from the cart
			$this->analyze_cart_contents();
			return;
		}

		$this->_load = true;

		$this->process_request();
		$this->analyze_cart_contents();
		$this->load_available_gifts();
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
			$product = $item['data'];
		
			if ($this->is_gift($item['data'])) {
				$item_type = 'gift';
				$item_id = ($item['data']->get_type() === DGFW::GIFT_PRODUCT_TYPE) ? $item['data']->get_id() : $item['data']->get_parent_id();
				if ($gift_categories = get_the_terms($item_id, DGFW::GIFTS_TAXONOMY)) {
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
				$item_id = $item['data']->get_id();
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
			self::$_cart[$item_type]['ids'][$item_id] = $item['quantity'];
		}

		// die(var_dump(self::$_cart));

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
		$id = ($gift->get_type() === DGFW::GIFT_PRODUCT_TYPE) ? $gift->get_id() : $gift->get_parent_id();

		$gift_categories = get_the_terms($id, DGFW::GIFTS_TAXONOMY);

		if (!$gift_categories || is_wp_error($gift_categories)) {
			return false;
		}

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
		// for variable products, check variations

		if ($gift->get_type() === 'variable' && empty($gift->get_children())) {
			return false;
		}

		// for giftable variations, check parent stock status
		if (($gift->get_type() === 'variation') && (($parent = WC()->product_factory->get_product($gift->get_parent_id())) && !($parent->is_in_stock()))) {
			return false;
		}

		// if gift is already added to cart
		if (array_key_exists($gift->get_id(), self::$_cart['gift']['ids'])) {
			return false;
		}

		// check all gift categories for number of gifts allowed
		$gift_id = ($gift->get_type() === DGFW::GIFT_PRODUCT_TYPE) ? $gift->get_id() : $gift->get_parent_id();
		$gift_categories = get_the_terms($gift_id, DGFW::GIFTS_TAXONOMY);

		if ($gift_categories) {
			foreach ($gift_categories as $gtc) {
				$gift_category = new DGFW_CategoryPublic($gtc);
				if (($gift_category->number_of_gifts_allowed() <= $this->number_of_gifts_chosen($gtc->term_id))) {
					return false;
				}
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
					WC()->cart->add_to_cart($product->get_parent_id(), 1, $product_id);
				} else {
					WC()->cart->add_to_cart($product_id, 1);
				}

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

	public function gift_cart_sold_individually($sold_individually, $_product)
	{
		if ($this->is_gift($_product)) {
			return true;
		}

		return $sold_individually;
	}

	public function gift_cart_data($item_data, $cart_item)
	{

		if ($this->is_gift($cart_item['data']) && (WC_Admin_Settings::get_option('woocommerce_dgfw_cart_show_gift_note', 'yes') === 'yes')) {
			$key = WC_Admin_Settings::get_option('woocommerce_dgfw_cart_gift_note_title', __('Note', DGFW::TRANSLATION));
			$value = WC_Admin_Settings::get_option('woocommerce_dgfw_cart_gift_note_text', __('This product is a free gift.', DGFW::TRANSLATION));
			$item_data[] = array(
				'key' => $key ? $key : __('Note', DGFW::TRANSLATION),
				'value' => $value ? $value : __('This product is a free gift.', DGFW::TRANSLATION),
			);
		}

		return $item_data;
	}

	public function gift_cart_title($title, $cart_item, $cart_item_key)
	{
		if ($this->is_gift($cart_item['data'])) {
			$title = sprintf( '<a href="%s">%s</a>', esc_url( $cart_item['data']->get_permalink( $cart_item ) ), $title /*$cart_item['data']->get_title()*/ );
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

	/**
	 *
	 * Returns the number of gift variations for a gift, if any
	 *
	 */
	public static function gift_has_giftable_variations($gift)
	{
		if ($gift && in_array($gift->get_type(),array(DGFW::GIFT_PRODUCT_TYPE, 'variable'))) {
			$has_giftable_variations = get_post_meta($gift->get_id(), '_dgfw_has_giftable_variations', true);

			// variable products can be giftable, or have giftable variations
			// if the product is giftable, all variations are giftable too
			if ($gift->get_type() === 'variable') {
				$is_giftable = get_post_meta($gift->get_id(), '_' . DGFW::GIFT_PRODUCT_OPTION, true);

				return $is_giftable === 'yes' || $has_giftable_variations === 'yes';
			}

			return $has_giftable_variations === 'yes';
		}

		return false;
	}

	/**
	 *
	 * For giftable variations, use original variation image in the cart
	 *
	 */
	public function gift_cart_thumbnail($image, $cart_item = false, $cart_item_key = false)
	{
		if ($cart_item && $cart_item['variation_id'] && $this->is_gift($cart_item['data']) ) {
			$original_variation_id = get_post_meta($cart_item['variation_id'], '_' . DGFW::GIFT_VARIATION_OPTION . '_original', true);

			if ($original_variation_id && $original_variation = WC()->product_factory->get_product($original_variation_id)) {
				$image = $original_variation->get_image();
			}
		}

		return $image;
	}

	/**
	 *
	 * Modify add to cart message for giftable variations added on the cart page
	 *
	 */
	public function add_to_cart_message($message, $product_id)
	{
		// only on the cart page, but we can't use is_cart if the product
		// is added via ajax, so we check for our own hidden input
		if (isset($_REQUEST['dgfw_chosen_gift'])) {
			$message = __( 'Your free gift has been added.', DGFW::TRANSLATION );
		}

		return $message;
	}


}
