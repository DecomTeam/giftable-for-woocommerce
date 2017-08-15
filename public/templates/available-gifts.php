<?php
/**
 *
 * Product gift options data tab content
 *
 * vars:
 *
 * $available_gifts
 *
 */
// TODO: normal add to cart button if only one variation...
?>
<div class="dgfw-available-gifts">
    <div id="dgfw-choose-gift">
        <h3 class="dgfw-available-gifts-title"><?php esc_html_e(WC_Admin_Settings::get_option('woocommerce_dgfw_carousel_title', __( 'Choose your free gift', DGFW::TRANSLATION ))); ?></h3>
        <?php if ($description = WC_ADMIN_SETTINGS::get_option('woocommerce_dgfw_carousel_description', '')) : ?>
            <div class="dgfw-available-gifts-description">
                <?php echo wpautop($description); ?>
            </div>
        <?php endif; ?>
        <div id="dgfw-gifts-carousel" class="dgfw-gifts-carousel">
            <?php foreach ($available_gifts as $gift) : ?>
                <div id="dgfw-gift-<?php echo $gift->get_id(); ?>" class="dgfw-gift">
                    <a href="<?php echo $gift->get_permalink(); ?>" class="dgfw-gift-link">
                        <div class="dgfw-gift-thumbnail product-thumbnail">
                            <?php
                                $thumbnail = $gift->get_image();

                                echo $thumbnail;
                            ?>
                        </div>
                        <h5 class="product-name"><?php echo esc_html($gift->get_title()); ?></h5>
                    </a>
                    <?php if (DGFW_Public::gift_has_giftable_variations($gift)) : ?>
                        <button id="dgfw-gift-link-<?php echo $gift->get_id(); ?>" name="update_cart" class="button dgfw-select-gift-button" data-gift="<?php echo $gift->get_id(); ?>"><?php esc_html_e(WC_Admin_Settings::get_option('woocommerce_dgfw_gift_select_button_title', __( 'Select options', DGFW::TRANSLATION ))); ?></button>
                    <?php else: ?>
                        <button id="dgfw-gift-link-<?php echo $gift->get_id(); ?>" name="update_cart" class="button dgfw-add-gift-button" data-gift="<?php echo $gift->get_id(); ?>"><?php esc_html_e(WC_Admin_Settings::get_option('woocommerce_dgfw_gift_button_title', __( 'Add to cart', DGFW::TRANSLATION ))); ?></button>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
        <input type="hidden" id="dgfw_chosen_gift" name="dgfw_chosen_gift" value=""/>
    </div>
    <div id="dgfw-gift-variations"><!-- populated by JavaScript --></div>
</div>