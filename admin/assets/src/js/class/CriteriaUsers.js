import Criteria from './Criteria.js';
import MetaUsers from './MetaUsers.js';
import Translate from './Translate.js';
import $ from '../jquery.js';

export default class CriteriaUsers extends Criteria {

    init() {
        this._type = 'users';

        if (this._sourceCriteria) {
            this.takeOverFromSource();
        }

        this._users = new MetaUsers(this._id + '-users', { label: Translate.text('Users'), value: this._conditions.users ? this._conditions.users.value : false  });

        this._steps = new Array();

        var userElements = this._users.elements();

        this._steps[0] = {
            description: Translate.text('Select users this gift category applies for.'),
            help: Translate.text('This condition will be met if the customer is logged in as any of the selected users below.'),
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_users_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: userElements,
                }
            ],
        };

        this.showCriteria();

        this._bindings = this._bindings.concat(this._users.bindings());

        this._bindings.push({
            selector: '#' + this._users.elementId(),
            event: this._users.selectionChangedEvent(),
            object: this,
            method: 'readjustSize'
        });

        super.init();

    }

}