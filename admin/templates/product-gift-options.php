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
 *
 */
?>
<div id="<?php echo $panel_id; ?>" class="panel woocommerce_options_panel">
    <div class="options-group">
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