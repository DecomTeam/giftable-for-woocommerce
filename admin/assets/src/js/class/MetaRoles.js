import Meta from './Meta.js';
import $ from '../jquery.js';

export default class MetaRoles extends Meta {


    init() {
        this._label = this._options.label;
        this._inputElementId = 'dgfw_criteria_roles_' + this._id;
        this._inputElementName = 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]';

        this._value = this._options.value || new Array();

        var roleElements = new Array();

        if (decomGiftable.screen.data.roles) {
            decomGiftable.screen.data.roles.forEach((role, index, collection) => {
                roleElements.push(this.roleElement(role));
            });
        }


        this._elements = [
            {
                tag: 'div',
                id: 'dgfw_select_roles_' + this._id,
                classes: ['dgfw-checkbox-group-wrapper'],
                children: roleElements,
            }
        ];


        super.init();

    }


   roleElement(role) {
        var checkBoxAttributes = {
            type: 'checkbox',
            name: this._inputElementName + '[]',
            value: role.name,
        };

        this._value.forEach((roleName, index, collection) => {
            if (roleName === role.name) {
                checkBoxAttributes.checked = 'checked';
            }
        });

        return {
            tag: 'div',
            id: 'dgfw_criteria_roles_' + this._id + '_role_' + role.name,
            classes: ['dgfw-roles-select'],
            attributes: {
                'data-decom-id': role.name,
            },
            children: [
                {
                    tag: 'input',
                    id: 'dgfw_roles_select_' + this._id + '_checkbox_' + role.name,
                    classes: ['dgfw-roles-select-checkbox'],
                    attributes: checkBoxAttributes,
                },
                {
                    tag: 'label',
                    classes: ['dgfw-roles-select-label'],
                    text: role.title,
                    attributes: {
                        for: 'dgfw_roles_select_' + this._id + '_checkbox_' + role.name,
                    }
                },
            ],
        };
    }

}