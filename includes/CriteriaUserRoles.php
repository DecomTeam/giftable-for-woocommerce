<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Criteria.php';
require_once 'MetaUserRoles.php';

/**
 * User roles criteria class
 *
 * @since      0.9.0
 *
 */
class DGFW_CriteriaUserRoles extends DGFW_Criteria {

    private $_roles;

    public function __construct($conditions)
    {
        parent::__construct($conditions);

        // add empty roles array if none are selected...
        if (!isset($conditions['roles'])) {
            $conditions['roles'] = array(
                'value' => array(),
            );
        }

        $this->_roles = new DGFW_MetaUserRoles($conditions['roles']);
    }

    protected function check_self()
    {
        $user = wp_get_current_user();
        $this->_checks_out = $this->_roles->check_for($user->roles);
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['roles'] = $this->_roles->meta();

        return $meta;
    }

}
