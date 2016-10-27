import Meta from './Meta.js';
import $ from '../jquery.js';
import Debug from './Debug.js';
import Translate from './Translate.js';

export default class MetaUsers extends Meta {


    init() {
        this._label = this._options.label;
        this._inputElementId = 'dgfw_criteria_users_' + this._id;
        this._containerId = 'dgfw_critera_users_select_' + this._id;
        this._selectedListId = 'dgfw_criteria_users_' + this._id + '_selected_list';

        this._navPrevId = 'dgfw_criteria_users_select_nav_prev_' + this._id;
        this._navNextId = 'dgfw_criteria_users_select_nav_next_' + this._id;
        this._statusCurrentPageId = 'dgfw_criteria_users_select_nav_status_current_' + this._id;
        this._statusTotalPagesId = 'dgfw_criteria_users_select_nav_status_total_' + this._id;

        this._value = new Object();

        if (this._options.value) {
            this._options.value.split(',').forEach((userId) => {
                if (parseInt(userId)) {
                    this._value[userId] = userId;
                }
            });
        }

        this._currentPage = 0;
        this._totalUsers = 0;
        this._totalPages = 1;
        this._usersPerPage = 5;
        var userElements = new Array();

        if (decomGiftable.screen.data.users) {
            this._totalUsers = decomGiftable.screen.data.users.length;
            this._totalPages = Math.ceil(this._totalUsers/this._usersPerPage);
            decomGiftable.screen.data.users.forEach((user, index, collection) => {
                userElements[Math.floor((index)/this._usersPerPage)] = userElements[Math.floor((index)/this._usersPerPage)] || new Array();
                userElements[Math.floor((index)/this._usersPerPage)].push(this.userElement(user));
            });
        }

        var userPages = new Array();

        userElements.forEach((userPage, index, collection) => {
            userPages[index] = {
                tag: 'div',
                id: this._containerId + '_page_' + index,
                classes: ['dgfw-select-users-container-page', 'page-' + index, (index === 0 ? 'page-current' : '')],
                children: userPage,
            };
        });


        var selectedUsersElement = {
            tag: 'div',
            id: this._selectedListId,
            classes: ['dgfw-selected-users'],
            children: []
        };

        if (Object.keys(this._value).length) {
            for (var selectedUserId in this._value) {
                let selectedUser = this.user(parseInt(selectedUserId));
                if (this._value[selectedUserId] && selectedUser) {
                    selectedUsersElement.children.push(this.selectedUserElement(selectedUser, false));
                }
            }
        } else {
            selectedUsersElement.classes.push('invisible');
        }


        this._elements = [
            selectedUsersElement,
            {
                tag: 'div',
                id: this._containerId,
                classes: ['dgfw-select-wrapper', 'dgfw-select-users', 'current-page-0'],
                children: userPages,
            },
            {
                tag: 'input',
                id: this._inputElementId,
                classes: ['dgfw-users'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]',
                    type: 'hidden',
                    value: Object.keys(this._value).join(','),
                },
            },
        ];

        if (this._totalPages > 1) {
            this._elements.splice(1, 0,
                {
                    tag: 'div',
                    id: 'dgfw_criteria_users_select_nav_' + this._id,
                    classes: ['dgfw-select-users-nav'],
                    children: [
                        {
                            tag: 'button',
                            id: this._navPrevId,
                            classes: ['dgfw-select-users-nav-prev', 'button', 'dgfw-button-secondary', 'dashicons-before', 'dashicons-arrow-left'],
                        },
                        {
                            tag: 'span',
                            id: 'dgfw_criteria_select_nav_status_' + this._id,
                            classes: ['dgfw-select-users-nav-status'],
                            children: [
                                {
                                    tag: 'span',
                                    id: '',
                                    classes: [],
                                    text: Translate.text('Page '),
                                },
                                {
                                    tag: 'span',
                                    id: this._statusCurrentPageId,
                                    classes: ['dgfw-select-users-nav-status-number'],
                                    text: this._currentPage + 1
                                },
                                {
                                    tag: 'span',
                                    id: '',
                                    classes: [],
                                    text: Translate.text(' of '),
                                },
                                {
                                    tag: 'span',
                                    id: this._statusTotalPagesId,
                                    classes: ['dgfw-select-users-nav-status-number'],
                                    text: this._totalPages
                                }
                            ]
                        },
                        {
                            tag: 'button',
                            id: this._navNextId,
                            classes: ['dgfw-select-users-nav-prev', 'button', 'dgfw-button-secondary', 'dashicons-before', 'dashicons-arrow-right'],
                        }
                    ]
                }
            );
        }

        this._bindings.push(
            {
                selector: '#' + this._containerId,
                event: 'mouseover',
                object: this,
                method: 'loadNextPage'
            },
            {
                selector: '#' + this._navPrevId,
                event: 'click',
                object: this,
                method: 'previousPage'
            },
            {
                selector: '#' + this._navNextId,
                event: 'click',
                object: this,
                method: 'nextPage'
            },
            {
                selector: '.dgfw-users-select-user',
                event: 'click',
                object: this,
                method: 'toggleSelectUser'
            },
            {
                selector: '.dgfw-users-selected-remove',
                event: 'click',
                object: this,
                method: 'removeSelectedUser'
            }

        );

        super.init();

    }

    hookElements() {
        super.hookElements();
        this._$containerElement = this._$containerElement || $(document.getElementById(this._containerId));
        this._$selectedListElement = this._$selectedListElement || $(document.getElementById(this._selectedListId));
        this._$currentPageStatus = this._$currentPageStatus || $(document.getElementById(this._statusCurrentPageId));
    }

    containerId() {
        return this._containerId;
    }

    loadNextPage() {
        this.hookElements();
        Debug.info('Loading more users...');
    }

    userElement(user) {
        var userClasses = ['dgfw-users-select-user'];

        if (this._value[user.id]) {
            userClasses.push('selected');
        }

        return {
            tag: 'div',
            id: 'dgfw_criteria_users_' + this._id + '_user_' + user.id,
            classes: userClasses,
            attributes: {
                'data-decom-id': user.id,
            },
            children: [
                {
                    tag: 'h4',
                    classes: ['dgfw-users-select-user-name'],
                    text: user.displayName.length < 30 ? user.displayName : user.displayName.slice(0, 30) + '…',
                },
                {
                    tag: 'div',
                    classes: ['dgfw-users-select-user-img'],
                    attributes: {
                        style: 'background-image: url(' + user.img + ');',
                    }
                },
            ],
        };
    }

    selectedUserElement(user, invisible = true) {
        var selectedClasses = ['dgfw-users-selected-user'];

        if (invisible) {
            selectedClasses.push('invisible');
        }

        return {
            tag: 'div',
            id: 'dgfw_criteria_users_' + this._id + '_selected_' + user.id,
            classes: selectedClasses,
            attributes: {
                'data-decom-id': user.id,
            },
            children: [
                {
                    tag: 'h4',
                    classes: ['dgfw-users-select-user-name'],
                    text: user.displayName.length < 30 ? user.displayName : user.displayName.slice(0, 30) + '…',
                },
                {
                    tag: 'div',
                    classes: ['dgfw-users-select-user-img'],
                    attributes: {
                        style: 'background-image: url(' + user.img + ');',
                    }
                },
                {
                    tag: 'span',
                    id: 'dgfw_criteria_users_selected_remove_' + user.id,
                    classes: ['dgfw-users-selected-remove', 'dashicons-before', 'dashicons-no'],
                    attributes: {
                        'data-decom-id': user.id
                    }
                },
            ],
        };
    }

    toggleSelectUser(event) {
        this.hookElements();
        var $user = $(event.currentTarget);
        var userId = parseInt($user.data('decom-id'));
        $user.toggleClass('selected');
        if (this._value[userId]) {
            delete this._value[userId];
            this.removeFromList(userId);
        } else {
            this._value[userId] = userId;
            this.addToList(userId);
        }
        this._$inputElement.val(Object.getOwnPropertyNames(this._value).join(','));
    }

    removeSelectedUser(event) {
        this.hookElements();
        var $user = $(event.currentTarget);
        var userId = parseInt($user.data('decom-id'));
        $user = $('#dgfw_criteria_users_' + this._id + '_user_' + userId);
        $user.removeClass('selected');
        if (this._value[userId]) {
            delete this._value[userId];
            this.removeFromList(userId);
        }
        this._$inputElement.val(Object.getOwnPropertyNames(this._value).join(','));
    }

    addToList(userId) {
        var user = this.user(userId);
        this.createAndAppendChild(this._$selectedListElement, this.selectedUserElement(user));
        setTimeout(() =>  {
            this._$selectedListElement.removeClass('invisible');
            this.$userElement(userId).removeClass('invisible');
            setTimeout(() => {
                this.selectionChanged();
            }, 300);
        }, 50);
    }

    removeFromList(userId) {
        var $user = this.$userElement(userId)
        $user.addClass('invisible');
        setTimeout(() => {
            if (Object.keys(this._value).length === 0) {
                this._$selectedListElement.addClass('invisible');
            }
            $user.remove();
            setTimeout(() => {
                this.selectionChanged();
            }, 300);
        }, 50);
    }

    selectionChangedEvent() {
        return 'DGFW.SelectionChanged_' + this._id;
    }

    selectionChanged() {
        this._$inputElement.trigger(this.selectionChangedEvent());
    }

    user(userId) {
        var user = false;

        decomGiftable.screen.data.users.forEach((userData, index, users) => {
            if (userData.id === userId) {
                user = userData;
            }
        });

        return user;
    }

    $userElement(userId) {
        return $(document.getElementById('dgfw_criteria_users_' + this._id + '_selected_' + userId));
    }

    createAndAppendChild($parentElement, childData) {
        var $el = $(document.createElement(childData.tag));
        $el.attr('id', childData.id);
        if (childData.classes) {
            $el.addClass(childData.classes.join(' '));
        }
        if (childData.attributes) {
            for (let attr in childData.attributes) {
                $el.attr(attr, childData.attributes[attr]);
            }
        }
        if (childData.text) {
            $el.text(childData.text);
        }
        $parentElement.append($el);
        if (childData.children) {
            childData.children.forEach((elementData, index, collection) => {
                this.createAndAppendChild($el, elementData);
            });
        }
        return $el;
    }

    previousPage() {
        this.hookElements();
        this._currentPage -= (this._currentPage > 0 ? 1 : 0);
        this._$containerElement.find('.page-' + (this._currentPage + 1)).removeClass('page-current');
        this._$containerElement.find('.page-' + this._currentPage).removeClass('page-prev').addClass('page-current');
        this.updateCurrentPageStatus();
    }

    nextPage() {
        this.hookElements();
        this._currentPage += (this._currentPage < this._totalPages - 1 ? 1 : 0);
        this._$containerElement.find('.page-' + (this._currentPage - 1)).removeClass('page-current').addClass('page-prev');
        this._$containerElement.find('.page-' + this._currentPage).addClass('page-current');
        this.updateCurrentPageStatus();
    }

    updateCurrentPageStatus() {
        this.hookElements();
        this._$currentPageStatus.text(this._currentPage + 1);
    }
}