import Meta from './Meta.js';
import $ from '../jquery.js';
import Debug from './Debug.js';
import Translate from './Translate.js';

export default class MetaPosts extends Meta {


    init() {
        this._postType = this._options.postType;
        this._label = this._options.label;
        this._inputElementId = 'dgfw_criteria_posts_' + this._id;
        this._containerId = 'dgfw_critera_posts_select_' + this._id;
        this._selectedListId = 'dgfw_criteria_posts_' + this._id + '_selected_list';

        this._advancedContainerId = 'dgfw_criteria_posts_advanced_settings_' + this._id;
        this._advancedListId = 'dgfw_criteria_posts_' + this._id + '_advanced_list';

        this._navPrevId = 'dgfw_criteria_posts_select_nav_prev_' + this._id;
        this._navNextId = 'dgfw_criteria_posts_select_nav_next_' + this._id;
        this._statusCurrentPageId = 'dgfw_criteria_posts_select_nav_status_current_' + this._id;
        this._statusTotalPagesId = 'dgfw_criteria_posts_select_nav_status_total_' + this._id;
        this._value = new Object();

        if (this._options.value) {
            this._value = this._options.value;
        }

        this._currentPage = 0;
        this._totalProducts = 0;
        this._totalPages = 1;
        this._productsPerPage = $(window).width() > 1023 ? 5 : 3;
        var productElements = new Array();

        if (decomGiftable.screen.data.products) {
            this._totalProducts = decomGiftable.screen.data.products.length;
            this._totalPages = Math.ceil(this._totalProducts/this._productsPerPage);
            decomGiftable.screen.data.products.forEach((product, index, collection) => {
                productElements[Math.floor((index)/this._productsPerPage)] = productElements[Math.floor((index)/this._productsPerPage)] || new Array();
                productElements[Math.floor((index)/this._productsPerPage)].push(this.productElement(product));
            });
        }

        var productPages = new Array();

        productElements.forEach((productPage, index, collection) => {
            productPages[index] = {
                tag: 'div',
                id: this._containerId + '_page_' + index,
                classes: ['dgfw-select-posts-container-page', 'page-' + index, (index === 0 ? 'page-current' : '')],
                children: productPage,
            };
        });

        var selectedProductsElement = {
            tag: 'div',
            id: this._selectedListId,
            classes: ['dgfw-selected-posts'],
            children: []
        };

        var advancedElement = {
            tag: 'div',
            id: this._advancedListId,
            classes: ['dgfw-advanced-posts'],
            children: []
        };

        if (Object.keys(this._value).length) {
            for (var selectedProductId in this._value) {
                let selectedProduct = this.post(parseInt(selectedProductId));
                if (this._value[selectedProductId] && selectedProduct) {
                    selectedProductsElement.children.push(this.selectedProductElement(selectedProduct, false));
                    advancedElement.children.push(this.advancedProductElement(selectedProduct, this._value[selectedProductId]));
                }
            }
        } else {
            selectedProductsElement.classes.push('invisible');
        }

        this._elements = [
            selectedProductsElement,
            {
                tag: 'div',
                id: this._containerId,
                classes: ['dgfw-select-wrapper', 'dgfw-select-posts', 'current-page-0'],
                children: productPages,
            },
            {
                tag: 'input',
                id: this._inputElementId,
                classes: ['dgfw-products'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]',
                    type: 'hidden',
                    value: Object.keys(this._value).join(','),
                },
            },
            {
                tag: 'input',
                id: this._inputElementId + '_post_types',
                classes: ['dgfw-products'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][post_types][]',
                    type: 'hidden',
                    value: this._postType,
                },
            },
        ];

        if (this._totalPages > 1) {
            this._elements.splice(1, 0,
                {
                    tag: 'div',
                    id: 'dgfw_criteria_posts_select_nav_' + this._id,
                    classes: ['dgfw-select-posts-nav'],
                    children: [
                        {
                            tag: 'button',
                            id: this._navPrevId,
                            classes: ['dgfw-select-posts-nav-prev', 'button', 'dgfw-button-secondary', 'dashicons-before', 'dashicons-arrow-left'],
                        },
                        {
                            tag: 'span',
                            id: 'dgfw_criteria_select_nav_status_' + this._id,
                            classes: ['dgfw-select-posts-nav-status'],
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
                                    classes: ['dgfw-select-posts-nav-status-number'],
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
                                    classes: ['dgfw-select-posts-nav-status-number'],
                                    text: this._totalPages
                                }
                            ]
                        },
                        {
                            tag: 'button',
                            id: this._navNextId,
                            classes: ['dgfw-select-posts-nav-prev', 'button', 'dgfw-button-secondary', 'dashicons-before', 'dashicons-arrow-right'],
                        }
                    ]
                }
            );
        }


        this._advancedElements = [
            {
                tag: 'div',
                id: this._advancedContainerId,
                classes: ['dgfw-advanced-wrapper'],
                children: [advancedElement],
            }
        ];


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
                selector: '.dgfw-posts-select-post',
                event: 'click',
                object: this,
                method: 'toggleSelectPost'
            },
            {
                selector: '.dgfw-posts-selected-remove',
                event: 'click',
                object: this,
                method: 'removeSelectedPost'
            }

        );

        super.init();
    }

    hookElements() {
        super.hookElements();
        this._$containerElement = this._$containerElement || $(document.getElementById(this._containerId));
        this._$selectedListElement = this._$selectedListElement || $(document.getElementById(this._selectedListId));
        this._$currentPageStatus = this._$currentPageStatus || $(document.getElementById(this._statusCurrentPageId));
        this._$advancedListElement = this._$advancedListElement || $(document.getElementById(this._advancedListId));
    }

    containerId() {
        return this._containerId;
    }

    loadNextPage() {
        this.hookElements();
        Debug.info('Loading more products...');
    }

    productElement(product) {
        var productClasses = ['dgfw-posts-select-post'];

        if (this._value[product.id]) {
            productClasses.push('selected');
        }

        return {
            tag: 'div',
            id: 'dgfw_criteria_posts_' + this._id + '_product_' + product.id,
            classes: productClasses,
            attributes: {
                'data-decom-id': product.id,
            },
            children: [
                {
                    tag: 'h4',
                    classes: ['dgfw-posts-select-post-title'],
                    text: product.title.length < 30 ? product.title : product.title.slice(0, 30) + '…',
                },
                {
                    tag: 'div',
                    classes: ['dgfw-posts-select-post-img'],
                    attributes: {
                        style: 'background-image: url(' + product.img + ');',
                    }
                },
            ],
        };
    }

    selectedProductElement(product, invisible = true) {
        var selectedClasses = ['dgfw-posts-selected-post'];

        if (invisible) {
            selectedClasses.push('invisible');
        }

        return {
            tag: 'div',
            id: 'dgfw_criteria_posts_' + this._id + '_selected_' + product.id,
            classes: selectedClasses,
            attributes: {
                'data-decom-id': product.id,
            },
            children: [
                {
                    tag: 'h4',
                    classes: ['dgfw-posts-select-post-title'],
                    text: product.title.length < 30 ? product.title : product.title.slice(0, 30) + '…',
                },
                {
                    tag: 'div',
                    classes: ['dgfw-posts-select-post-img'],
                    attributes: {
                        style: 'background-image: url(' + product.img + ');',
                    }
                },
                {
                    tag: 'span',
                    id: 'dgfw_criteria_posts_selected_remove_' + product.id,
                    classes: ['dgfw-posts-selected-remove', 'dashicons-before', 'dashicons-no'],
                    attributes: {
                        'data-decom-id': product.id
                    }
                },
            ],
        };
    }

    advancedProductMinItemsInputId(productId) {
        return 'dgfw_criteria_posts_advanced_min_items_' + productId;
    }

    advancedProductElement(product, productAdvancedSettings) {
        var advancedClasses = ['dgfw-posts-advanced-post'];
        var minItemsInputId = this.advancedProductMinItemsInputId(product.id);


        return {
            tag: 'div',
            id: 'dgfw_criteria_posts_' + this._id + '_advanced_' + product.id,
            classes: advancedClasses,
            attributes: {
                'data-decom-id': product.id,
            },
            children: [
                {
                    tag: 'h4',
                    classes: ['dgfw-posts-select-post-title'],
                    text: product.title.length < 20 ? product.title : product.title.slice(0, 40) + '…',
                },
                {
                    tag: 'div',
                    classes: ['dgfw-posts-select-post-img'],
                    attributes: {
                        style: 'background-image: url(' + product.img + ');',
                    }
                },
                {
                    tag: 'span',
                    id: 'dgfw_criteria_posts_advanced_remove_' + product.id,
                    classes: ['dgfw-posts-selected-remove', 'dashicons-before', 'dashicons-no'],
                    attributes: {
                        'data-decom-id': product.id
                    }
                },
                {
                    tag: 'input',
                    id: minItemsInputId,
                    classes: ['dgfw-posts-advanced-min-items'],
                    attributes: {
                        type: 'number',
                        name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value][' + product.id + '][min_items]',
                        value: productAdvancedSettings.min_items,
                    }
                },
            ],
        };
    }

    toggleSelectPost(event) {
        this.hookElements();
        var $post = $(event.currentTarget);
        var postId = parseInt($post.data('decom-id'));
        $post.toggleClass('selected');
        if (this._value[postId]) {
            delete this._value[postId];
            this.removeFromList(postId);
        } else {
            this._value[postId] = {min_items: 1};
            this.addToList(postId);
        }
        this._$inputElement.val(Object.getOwnPropertyNames(this._value).join(','));
    }

    removeSelectedPost(event) {
        this.hookElements();
        var $post = $(event.currentTarget);
        var postId = parseInt($post.data('decom-id'));
        $post = $('#dgfw_criteria_posts_' + this._id + '_product_' + postId);
        $post.removeClass('selected');
        if (this._value[postId]) {
            delete this._value[postId];
            this.removeFromList(postId);
        }
        // this._$inputElement.val(Object.getOwnPropertyNames(this._value).join(','));
    }

    addToList(postId) {
        var post = this.post(postId);
        this.createAndAppendChild(this._$selectedListElement, this.selectedProductElement(post));
        this.createAndAppendChild(this._$advancedListElement, this.advancedProductElement(post, {min_items: 1}));
        setTimeout(() =>  {
            this._$selectedListElement.removeClass('invisible');
            this.$postElement(postId).removeClass('invisible');
            setTimeout(() => {
                this.selectionChanged();
            }, 200);
        }, 50);
    }

    removeFromList(postId) {
        var $post = this.$postElement(postId);
        var $advancedPost = this.$advancedPostElement(postId);
        $post.addClass('invisible');
        setTimeout(() => {
            if (Object.keys(this._value).length === 0) {
                this._$selectedListElement.addClass('invisible');
            }
            $post.remove();
            $advancedPost.remove();
            setTimeout(() => {
                this.selectionChanged();
            }, 200);
        }, 50);
    }

    selectionChangedEvent() {
        return 'DGFW.SelectionChanged_' + this._id;
    }

    selectionChanged() {
        this._$inputElement.trigger(this.selectionChangedEvent());
    }

    post(postId) {
        var product = false;

        decomGiftable.screen.data.products.forEach((post, index, products) => {
            if (post.id === postId) {
                product = post;
            }
        });

        return product;
    }

    $postElement(postId) {
        return $(document.getElementById('dgfw_criteria_posts_' + this._id + '_selected_' + postId));
    }

    $advancedPostElement(postId) {
        return $(document.getElementById('dgfw_criteria_posts_' + this._id + '_advanced_' + postId));
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

    advancedElements() {
        return this._advancedElements;
    }

}