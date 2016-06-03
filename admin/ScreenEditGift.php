<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Screen.php';

/**
 * Edit gift screen class
 *
 * @since      0.9.0
 *
 */

class DGFW_ScreenEditGift extends DGFW_Screen {

    public function __construct($screen)
    {
        parent::__construct($screen);

        $this->_template = 'edit-gift';
    }

    protected function define_hooks()
    {
        parent::define_hooks();
    }

    public function localize_script($localization_data)
    {
        $localization_data['screen'] = array(
            'name' => 'edit-gift',
        );

        return $localization_data;
    }

    public function display_edit_interface()
    {
        $this->_template_vars['description'] = $this->_category->description();
        $this->_template_vars['criteria'] = $this->_category->criteria();
        $this->_template_vars['category_id'] = $this->_category->id();
        $this->_template_vars['errors'] = $this->_errors;
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
    }

}
