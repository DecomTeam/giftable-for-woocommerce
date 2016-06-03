<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

require_once 'Criteria.php';
require_once 'MetaUsers.php';

/**
 * Users criteria class
 *
 * @since      0.9.0
 *
 */
class DGFW_CriteriaUsers extends DGFW_Criteria {

    private $_users;

    public function __construct($conditions)
    {
        parent::__construct($conditions);

        $this->_users = new DGFW_MetaUsers($conditions['users']);
    }

    protected function check_self()
    {
        $user_id = get_current_user_id();
        $this->_checks_out = $this->_users->check_for($user_id);
    }

    public function meta()
    {
        $meta = parent::meta();

        $meta['users'] = $this->_users->meta();

        return $meta;
    }

}
