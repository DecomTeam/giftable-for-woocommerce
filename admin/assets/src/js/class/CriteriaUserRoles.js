import Criteria from './Criteria.js';
import MetaRoles from './MetaRoles.js';
import Translate from './Translate.js';
import $ from '../jquery.js';

export default class CriteriaUserRoles extends Criteria {

    init() {
        this._type = 'user_roles';

        if (this._sourceCriteria) {
            this.takeOverFromSource();
        }

        this._roles = new MetaRoles(this._id + '-roles', { label: Translate.text('Roles'), value: this._conditions.roles ? this._conditions.roles.value : false });

        this._steps = new Array();

        this._steps[0] = {
            description: Translate.text('Select user roles this gift category applies for.'),
            help: Translate.text('This condition will be met if the customer is a logged in user and has one of the user roles selected below.'),
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_roles_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._roles.elements(),
                }
            ],
        };

        this.showCriteria();

        this._bindings = this._bindings.concat(this._roles.bindings());

        super.init();

    }

}