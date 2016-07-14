<?php
/**
 *
 * Variation giftable option checkbox
 *
 * vars:
 *
 * $loop
 * $variation
 * $giftable
 *
 */
?>
<label><input type="checkbox" class="checkbox variable_is_giftable" name="variable_is_giftable[<?php echo $loop; ?>]" <?php checked( isset( $giftable ) ? $giftable : '', 'yes' ); ?> /> <?php _e( 'Giftable', DGFW::TRANSLATION ); ?> <?php echo wc_help_tip( __('If more than one product variation is marked as giftable, customers can select between them when they choose this product as their gift.', DGFW::TRANSLATION) ); ?></label>
