<?php
/**
 *
 * Product gift options data tab content
 *
 * vars:
 *
 * $panel_id
 * $gift_categories
 * $product_gift_categories
 * $has_giftbale_variations
 * $is_giftable
 */
?>
<div id="<?php echo $panel_id; ?>" class="panel woocommerce_options_panel">
    <input type="hidden" id="_dgfw_has_giftable_variations" name="_dgfw_has_giftable_variations" value="<?php echo $has_giftable_variations; ?>">
    <input type="hidden" id="_dgfw_was_giftable" name="_dgfw_was_giftable" value="<?php echo $is_giftable; ?>">
    <div class="options-group">
        <p class="show_if_has_giftable_variations_only">
            <strong><?php _e('NOTE: This product is not marked as giftable, but some of its variations are. Only those variations marked as giftable will be available as gifts when selected gift categories’ conditions are met.', DGFW::TRANSLATION); ?></strong>
        </p>
        <p class="form-field show_if_<?php echo DGFW::GIFT_PRODUCT_TYPE; ?> show_if_<?php echo DGFW::GIFT_PRODUCT_OPTION; ?>">
            <label for="_dgfw_gift_categories"><?php _e('Gift categories', DGFW::TRANSLATION); ?></label>

            <span class="dgfw-product-gift-categories">
                <?php foreach($gift_categories as $gift_category) : ?>

                    <label class="dgfw-product-gift-category-label" for="dgfw_category_<?php echo $gift_category['id']; ?>">
                        <input type="checkbox" id="dgfw_category_<?php echo $gift_category['id']; ?>" name="_dgfw_gift_categories[]" value="<?php echo $gift_category['id']; ?>" class="checkbox" <?php checked(in_array($gift_category['id'], $product_gift_categories)); ?> />

                        <?php echo esc_html($gift_category['title']); ?>
                    </label>

                    <br />

                <?php endforeach; ?>
            </span>
        </p>
    </div>
    <div class="options-group">
        <p class="form-field show_if_<?php echo DGFW::GIFT_PRODUCT_TYPE; ?> show_if_<?php echo DGFW::GIFT_PRODUCT_OPTION; ?>">
            <label for="_dgfw_gift_tabs"><?php _e('Show tabs', DGFW::TRANSLATION); ?></label>
            <input type="checkbox" class="checkbox" name="_dgfw_gift_tabs" id="_dgfw_gift_tabs" <?php checked($gift_tabs, 'yes'); ?>>
        </p>
    </div>
</div>