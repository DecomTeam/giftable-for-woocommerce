<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Screen.php';
require_once 'CategoryAdmin.php';
require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/CriteriaFactory.php';

/**
 * Edit category screen class
 *
 * @since      0.9.0
 *
 */

class DGFW_ScreenEditCategory extends DGFW_Screen {

    private $_category = false;

    public function __construct($screen)
    {
        parent::__construct($screen);

        $this->_template = 'edit-category';
    }

    protected function define_hooks()
    {
        parent::define_hooks();

        add_action( 'load-edit-tags.php', array($this, 'initialize_category'), 10);
        add_action( DGFW::GIFTS_TAXONOMY . '_edit_form_fields', array($this, 'display_edit_interface'), 10, 2 );
        add_action( 'edited_' . DGFW::GIFTS_TAXONOMY, array($this, 'save_category_criteria'), 10, 2 );

        // Add category screen table columns
        add_filter( 'manage_' . $this->_wp_screen->id . '_columns', array( $this, 'get_columns' ), 20, 1 );
        add_filter( 'manage_' . DGFW::GIFTS_TAXONOMY . '_custom_column', array($this, 'column_content'), 10, 4 );
        // TODO: Add category inline edit enable/disable
        // add_action( 'quick_edit_custom_box', array($this, 'quick_edit_custom_box'), 10, 1 );
    }

    public function get_columns($columns)
    {
        $columns['dgfw_enabled'] = __('Enabled', DGFW::TRANSLATION);

        return $columns;
    }

    public function column_content($column_content, $column_name, $term_id)
    {
        if ($column_name === 'dgfw_enabled') {
            $template_vars = array(
                'enabled' => (bool)get_term_meta($term_id, '_dgfw_enabled', true),
            );

            DGFW_Admin::print_template('category-enabled', $template_vars);
        }
    }

    public function quick_edit_custom_box($column_name)
    {
        if ($column_name === 'dgfw_enabled') {
            $template_vars = array(
                'enabled' => (bool)get_term_meta($term_id, '_dgfw_enabled', true),
            );

            DGFW_Admin::print_template('cetegory-quick-edit', $template_vars);
        }
    }

    public function localize_script($localization_data)
    {
        // only if the category was initialized
        if ($this->_category) {
            $localization_data['screen'] = array(
                'name' => 'edit-category',
                'data' => array(
                    'category' => array(
                        'id' => $this->_category->id(),
                        'elementId' => 'dgfw_category_criteria_' . $this->_category->id(),
                        'descriptionId' => 'dgfw_category_description',
                        'addButtonId' => 'dgfw_add_criteria',
                        'name' => $this->_category->name()
                    ),
                    'products' => DGFW::get_products(false, -1),
                    'productCategories' => DGFW::get_product_cats(),
                    'roles' => DGFW::get_roles(),
                    'users' => DGFW::get_users(false, -1),
                    'criteria' => $this->_category->criteria()->meta(),
                    'currency' => DGFW::get_currency(),
                    'currencies' => DGFW::get_currencies(),
                ),
                'translations' => $this->translations(),
            );
        }

        return $localization_data;
    }

    public function initialize_category()
    {
        // make sure we're on the edit term screen and not on the term list screen
        // WP gives us the same screen id for both
        if (isset($_REQUEST['tag_ID'])) {
            $term_id = (int) $_REQUEST['tag_ID'];
            $term = get_term($term_id);
            // only if we have a valid term to work with
            if (!is_wp_error($term)) {
                $this->_category = new DGFW_CategoryAdmin($term);
            }
        }
    }

    public function display_edit_interface()
    {
        $this->_template_vars['description'] = $this->_category->description();
        $this->_template_vars['criteria'] = $this->_category->criteria();
        $this->_template_vars['category_id'] = $this->_category->id();
        $this->_template_vars['errors'] = $this->_errors;
        $this->_template_vars['gifts_allowed'] = $this->_category->number_of_gifts_allowed();
        $this->_template_vars['enabled'] = (bool)get_term_meta($this->_category->id(), '_dgfw_enabled', true);
        $this->print_template();
    }

    public function save_category_criteria()
    {
        if (isset($_POST['dgfw_criteria'])) {
            $this->_errors = $this->_category->parse_criteria($_POST['dgfw_criteria']);
            if (!$this->have_errors()) {
                $this->_category->save_criteria();
            }
        } else {
            $this->_category->delete_criteria();
        }

        if (isset($_POST['dgfw_category_gifts_allowed'])) {
            $gifts_allowed = absint($_POST['dgfw_category_gifts_allowed']);
        } else {
            $gifts_allowed = 0;
        }

        $this->_category->save_number_of_gifts_allowed($gifts_allowed);

        $enabled = isset($_POST['dgfw_category_enabled']);

        $this->_category->save_enabled($enabled);
    }

    public function translations()
    {
        return array(
            'Next' => __('Next', DGFW::TRANSLATION),
            'Back' => __('Back', DGFW::TRANSLATION),
            'Remove' => __('Remove', DGFW::TRANSLATION),
            'AND' => __('AND', DGFW::TRANSLATION),
            'OR' => __('OR', DGFW::TRANSLATION),
            'Choose condition type:' => __('Choose condition type:', DGFW::TRANSLATION),
            'First condition' => __('First condition', DGFW::TRANSLATION),
            'Are you sure you want do remove this condition and all its child conditions?' => __('Are you sure you want do remove this condition and all its child conditions?', DGFW::TRANSLATION),
            'Amounts' => __('Amounts', DGFW::TRANSLATION),
            'This condition will be met if the <strong>total cart amount</strong> is within the defined min/max amounts range.' => __('This condition will be met if the <strong>total cart amount</strong> is within the defined min/max amounts range.', DGFW::TRANSLATION),
            'Items' => __('Items', DGFW::TRANSLATION),
            'This condition will be met if the <strong>total number of items in the cart</strong> is within the defined min/max items range.' => __('This condition will be met if the <strong>total number of items in the cart</strong> is within the defined min/max items range.', DGFW::TRANSLATION),
            'Products' => __('Products', DGFW::TRANSLATION),
            'This condition will be met if the customer has at least one item of any of the selected products in their cart. To specify a minimum quantity for each product, click the <strong>Product Quantities</strong> button below.' => __('This condition will be met if the customer has at least one item of any of the selected products in their cart. To specify a minimum quantity for each selected product, click the <strong>Product Quantities</strong> button below.', DGFW::TRANSLATION),
            'Product Categories' => __('Product Categories', DGFW::TRANSLATION),
            'Time Period' => __('Time Period', DGFW::TRANSLATION),
            'This condition will be met if the time of customer checkout is within the defined start/end time interval.' => __('This condition will be met if the time of customer checkout is within the defined start/end time interval.', DGFW::TRANSLATION),
            'Users' => __('Users', DGFW::TRANSLATION),
            'This condition will be met if the customer is logged in as any of the selected users below.' => __('This condition will be met if the customer is logged in as any of the selected users below.', DGFW::TRANSLATION),
            'User Roles' => __('User Roles', DGFW::TRANSLATION),
            'This condition will be met if the customer is a logged in user and has one of the user roles selected below.' => __('This condition will be met if the customer is a logged in user and has one of the user roles selected below.', DGFW::TRANSLATION),
            'Min amount' => __('Min amount', DGFW::TRANSLATION),
            'Max amount' => __('Max amount', DGFW::TRANSLATION),
            'Set amount range. Leave empty for no limits.' => __('Set amount range. Leave empty for no limits.', DGFW::TRANSLATION),
            'Min items' => __('Min items', DGFW::TRANSLATION),
            'Max items' => __('Max items', DGFW::TRANSLATION),
            'Set items range. Leave empty for no limits.' => __('Set items range. Leave empty for no limits.', DGFW::TRANSLATION),
            'Start date' => __('Start date', DGFW::TRANSLATION),
            'End date' => __('End date', DGFW::TRANSLATION),
            'Set start and end of this period.' => __('Set start and end of this period.', DGFW::TRANSLATION),
            'Terms' => __('Terms', DGFW::TRANSLATION),
            'Select Product Categories' => __('Select Product Categories', DGFW::TRANSLATION),
            'Select product categories this gift category applies for.' => __('Select product categories this gift category applies for.', DGFW::TRANSLATION),
            'This condition will be met then the customer has at least one product belonging to any of the selected product categories in their cart. To specify minimum amounts and/or items for each selected category, click the <strong>Amounts and Quantities</strong> button below.' => __('This condition will be met then the customer has at least one product belonging to any of the selected product categories in their cart. To specify minimum amounts and/or items for each selected category, click the <strong>Amounts and Quantities</strong> button below.', DGFW::TRANSLATION),
            'Amounts and Quantities' => __('Amounts and Quantities', DGFW::TRANSLATION),
            'Set up the minimum amount and/or number of items for each selected category.' => __('Set up the minimum amount and/or number of items for each selected category.', DGFW::TRANSLATION),
            'By default, this condition will be met if the customer has at least one product belonging to any of the selected product categories in their cart. You can change minimum amount and/or items for each selected category here. Leave the fields empty for default value (one item minimum, regardless of the amount).' => __('By default, this condition will be met if the customer has at least one product belonging to any of the selected product categories in their cart. You can change minimum amount and/or items for each selected category here. Leave the fields empty for default value (one item minimum, regardless of the amount).', DGFW::TRANSLATION),
            'Posts' => __('Posts', DGFW::TRANSLATION),
            'Select Products' => __('Select Products', DGFW::TRANSLATION),
            'Select products this gift category applies for.' => __('Select products this gift category applies for.', DGFW::TRANSLATION),
            'Product Quantities' => __('Product Quantities', DGFW::TRANSLATION),
            'Set minimum quantity for each selected product.' => __('Set minimum quantity for each selected product.', DGFW::TRANSLATION),
            'Roles' => __('Roles', DGFW::TRANSLATION),
            'Select user roles this gift category applies for.' => __('Select user roles this gift category applies for.', DGFW::TRANSLATION),
            'Users' => __('Users', DGFW::TRANSLATION),
            'Select users this gift category applies for.' => __('Select users this gift category applies for.', DGFW::TRANSLATION),
            'Page ' => __('Page ', DGFW::TRANSLATION),
            ' of ' => __(' of ', DGFW::TRANSLATION),
            ' at ' => __(' at ', DGFW::TRANSLATION),
            'Currency' => __('Currency', DGFW::TRANSLATION),
            '<strong>Multi-currency Note</strong>: This condition can be met only by customers shopping in the selected currency. You can cover other currencies by adding another "OR" Amount condition with appropriate min/max amounts for each enabled currency.' => __('<strong>Multi-currency Note</strong>: This condition can be met only by customers shopping in the selected currency. You can cover other currencies by adding another "OR" Amount condition with appropriate min/max amounts for each enabled currency.', DGFW::TRANSLATION),

        );
    }

}
