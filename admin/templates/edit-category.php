<?php
/**
 *
 * Edit category form template
 *
 */
?>
<tr class="form-field term-group-wrap">
    <th scope="row"><label for="feature-group"><?php _e('Enabled', DGFW::TRANSLATION) ?></label></th>
    <td class="dgfw-gifts-allowed-section">
        <input type="checkbox" id="dgfw_category_enabled" name="dgfw_category_enabled" class="dgfw-category-enabled" value="Yes" <?php checked($enabled); ?>>
    </td>
</tr>
<tr class="form-field term-group-wrap">
    <th scope="row"><label for="dgfw_category_gifts_allowed"><?php _e('Number of gifts allowed', DGFW::TRANSLATION) ?></label></th>
    <td class="dgfw-gifts-allowed-section">
        <input type="number" id="dgfw_category_gifts_allowed" name="dgfw_category_gifts_allowed" class="dgfw-category-gifts-allowed" value="<?php echo $gifts_allowed; ?>">
    </td>
</tr>
<tr class="form-field term-group-wrap">
    <th scope="row"><label for="feature-group"><?php _e('Gift category conditions', DGFW::TRANSLATION) ?></label></th>
    <td class="dgfw-section">
        <div class="dgfw-category-criteria" id="dgfw_category_criteria_<?php echo $category_id; ?>">
            <p id="dgfw_category_description" class="dgfw-category-description">
                <?php echo $description; ?>
            </p>

            <?php $criteria->template(); ?>
        </div>
    </td>
</tr>