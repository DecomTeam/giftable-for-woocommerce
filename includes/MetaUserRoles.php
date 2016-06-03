<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Meta.php';


/**
 * User roles meta class
 *
 * @since      0.9.0
 *
 */
class DGFW_MetaUserRoles extends DGFW_Meta {

    private $_include;
    private $_any;

    public function __construct($raw_meta)
    {
        parent::__construct($raw_meta, 'array');

        // TODO add include/exclude and any/all options
        $this->_include = true;
        $this->_any = true;

    }

    public function check_for($user_roles)
    {
        $includes = $this->_any ? $this->check_for_any($user_roles) : $this->check_for_all($user_roles);

        return $this->_include ? $includes : !$includes;
    }

    private function check_for_any($user_roles)
    {
        foreach ($user_roles as $role) {
            if (in_array($role, $this->_value)) {
                return true;
            }
        }

        return false;
    }

    private function check_for_all($user_roles)
    {
        foreach ($user_roles as $role) {
            if (!in_array($role, $this->_value)) {
                return false;
            }
        }

        return true;
    }
}
