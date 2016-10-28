<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( 'WC_Settings_Gifts' ) ) :

/**
 * WC_Settings_Gifts.
 *
 * @since 	0.9.0
 */
class WC_Settings_Gifts extends WC_Settings_Page {

	public function __construct() {

		$this->id    = 'gifts';
		$this->label = __( 'Giftable', DGFW::TRANSLATION );

		add_filter( 'woocommerce_settings_tabs_array', array( $this, 'add_settings_page' ), 20 );
		add_action( 'woocommerce_settings_' . $this->id, array( $this, 'output' ) );
		add_action( 'woocommerce_settings_save_' . $this->id, array( $this, 'save' ) );
	}

	public function get_settings() {
		$settings = apply_filters( 'woocommerce_' . $this->id . '_settings', array(

			array(	'title' => __( 'Gifts Options', DGFW::TRANSLATION ), 'type' => 'title', 'id' => 'gift_options' ),

			array(
				'title'         => __( 'Enable Gifts', DGFW::TRANSLATION ),
				'desc'          => __( 'Enable gifts functionality for this shop', DGFW::TRANSLATION ),
				'id'            => 'woocommerce_dgfw_enable_gifts',
				'default'       => 'yes',
				'type'          => 'checkbox',
				'checkboxgroup' => 'start',
				'autoload'      => false,
			),

			array(
				'title'    => __( 'Gifts carousel title', DGFW::TRANSLATION ),
				'desc'     => __( 'The title for the gifts carousel box shown to customers.', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_carousel_title',
				'default'  => __( 'Choose your free gift', DGFW::TRANSLATION ),
				'type'     => 'text',
				'desc_tip' =>  true,
			),

			array(
				'title'    => __( 'Gifts carousel description', DGFW::TRANSLATION ),
				'desc'     => __( 'Description of the available gifts box on the cart page.', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_carousel_description',
				'css'         => 'width:300px; height: 75px;',
				'default'  => '',
				'type'     => 'textarea',
				'desc_tip' =>  true,
			),

			array(
				'title'    => __( 'Add gift button title', DGFW::TRANSLATION ),
				'desc'     => __( 'Text for add gift to cart buttons show to customers.', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_gift_button_title',
				'default'  => __( 'Add to cart', DGFW::TRANSLATION ),
				'type'     => 'text',
				'desc_tip' =>  true,
			),

			array(
				'title'    => __( 'Select options button title', DGFW::TRANSLATION ),
				'desc'     => __( 'Text for select options buttons (for gifts with variations).', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_gift_select_button_title',
				'default'  => __( 'Select options', DGFW::TRANSLATION ),
				'type'     => 'text',
				'desc_tip' =>  true,
			),

			array(
				'title'         => __( 'Gift note in the cart', DGFW::TRANSLATION ),
				'desc'          => __( 'Show note for gifts in the cart', DGFW::TRANSLATION ),
				'id'            => 'woocommerce_dgfw_cart_show_gift_note',
				'default'       => 'yes',
				'type'          => 'checkbox',
				'checkboxgroup' => 'start',
				'autoload'      => false,
			),

			array(
				'title'    => __( 'Cart gift note title', DGFW::TRANSLATION ),
				'desc'     => __( 'Title of the gift note shown for each gift in the cart', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_cart_gift_note_title',
				'default'  => __( 'Note', DGFW::TRANSLATION ),
				'type'     => 'text',
				'desc_tip' =>  true,
			),

			array(
				'title'    => __( 'Cart gift note text', DGFW::TRANSLATION ),
				'desc'     => __( 'Text of the gift note shown for each gift in the cart', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_cart_gift_note_text',
				'default'  => __( 'This product is a free gift.', DGFW::TRANSLATION ),
				'type'     => 'text',
				'desc_tip' =>  true,
			),

			array(
				'title'    => __( 'Number of gifts per page on large screens (desktop)', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_carousel_gifts_large',
				'default'  => 4,
				'type'     => 'number',
			),

			array(
				'title'    => __( 'Number of gifts per page on medium screens (tablet)', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_carousel_gifts_medium',
				'default'  => 3,
				'type'     => 'number',
			),

			array(
				'title'    => __( 'Number of gifts per page on small screens (phone)', DGFW::TRANSLATION ),
				'id'       => 'woocommerce_dgfw_carousel_gifts_small',
				'default'  => 1,
				'type'     => 'number',
			),


			array( 'type' => 'sectionend', 'id' => 'gift_options'),

		) );

		return apply_filters( 'woocommerce_get_settings_' . $this->id, $settings );
	}
}

endif;

return new WC_Settings_Gifts();
