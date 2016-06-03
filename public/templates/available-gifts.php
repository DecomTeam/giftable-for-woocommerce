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
?>
<div class="dgfw-available-gifts">
    <div id="dgfw-choose-gift">
        <h3 class="dgfw-available-gifts-title"><?php _e('Choose your free gift', DGFW::TRANSLATION); ?></h3>
        <div id="dgfw-gifts-carousel" class="dgfw-gifts-carousel">
            <?php foreach ($available_gifts as $gift) : ?>
                <div id="dgfw-gift-<?php echo $gift->id; ?>" class="dgfw-gift">
                    <a href="<?php echo $gift->get_permalink(); ?>" class="dgfw-gift-link">
                        <div class="dgfw-gift-thumbnail product-thumbnail">
                            <?php
                                $thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $gift->get_image());

                                echo $thumbnail;
                            ?>
                        </div>
                        <p class="product-name"><?php echo esc_html($gift->post->post_title); ?></p>
                    </a>
                    <button id="dgfw-gift-link-<?php echo $gift->id; ?>" name="update_cart" class="button dgfw-add-gift-button" data-gift="<?php echo $gift->get_id(); ?>"><?php _e('Add to cart', DGFW::TRANSLATION); ?></button>
                </div>
            <?php endforeach; ?>
        </div>
        <input type="hidden" id="dgfw_chosen_gift" name="dgfw_chosen_gift" value=""/>
    </div>
</div>