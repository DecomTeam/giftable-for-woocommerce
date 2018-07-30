=== Giftable for WooCommerce ===

Contributors: decomteam, pixelhappystudio
Tags: gifts, giftable, free, woocommerce, woocommerce gifts, woocommerce-gift, gifts for woocommerce, woocommerce cart gifts
Requires at least: 4.4
Tested up to: 4.9.4
Stable tag: 1.0.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

Offer free gifts to your customers based on any number of easy to set up conditions (e.g. total amount and/or number of cart items on checkout).


This WooCommerce plugin enables you to offer free gifts to your customers on checkout, depending on any number of conditions you set up.

* Set up gift categories and add their conditions
* Select any of your existing products as giftable, or add new gift products, and assign them to one or more of predefined gift categories
* Any customer seeing their cart page can select gifts if they meet the conditions set up for any of the enabled gift categories
* Offer gifts based on cart amounts, number of items, date range, user roles, only for certain products or product categories, etc.
* Unlimited numbers and combinations of gift categories, conditions, and gifts. 

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress
1. Go to Products -> Gift categories and set up at least one gift category with the desired number of gifts allowed and conditions.
You can then mark any of the existing products as 'Giftable', or add new 'Gift' type products, and add them to one of the previously defined Gift categories


== Frequently Asked Questions ==

= How do I set up conditions for my gifts? =

Conditions are added to gift categories (Products -> Gift categories). There you can add new gift categories or edit any existing one. Just click the category to open it in a new editing screen, and add/edit/remove any possible combination of conditions for your gifts. When you have your gift categories ready, you can assign any giftable product to that gift category.

= How do I assign a gift category to a gift? =

On the 'Product data' meta box in the product editing screen, you can mark any existing WooCommerce product as 'Giftable', or add new products and select 'Gift' as product type. You will then see a new product options tab called 'Gift options', where you can select and assign Gift categories for a gift or a giftable product. Gifts and giftable products unassigned to at least one enabled Gift category will not be available to customers.

= Can I hide product tabs for gifts? =

There is a 'Show tabs' options for each gift on the Edit product screen 'Gift option' tab, and it's disabled by default.

= Can I change the gift box and buttons titles? =

Yes. You can do that on the Gifts settings tab (WooCommerce -> Settings -> Gifts). You'll find a number of other useful settings on that page too.

= Does it work with variable products? =

Yes. (Since version 0.9.4). You can mark any variable products as giftable, or only a number of its specific variations. If a variable product is marked as giftable, all of its variations will be available as gifts (within the Gift categories assigned). If the product is not marked as giftable, but some of its variations are, only those variations will be offered.

= Does it work with WPML? =

Yes. You will need to translate all gift categories, gifts and giftable products and set them up in each language sepparately though.

= Does it work in a multi-currency setup? =

Yes. For now the plugin integrates well with WooCommerce Multilingual multi-currency feature, and the Aelia Currency Switcher plugin.

= Why is this plugin free? =

This plugin is completely free, and will remain so. We make enough money developing custom solutions for WordPress and WooCommerce, and this is our way to give back to the community.

== Screenshots ==

1. Adding new gift category
2. Setting up gift category conditions
3. Adding new gift products

== Changelog ==

= 1.0.2 =
* when WPML activated - fix Gift Categories (blank screen)
= 1.0.1 =
* WooCommerce 3.3.1+ fix buttons (enable button: add to cart)
= 1.0 =
* WooCommerce 3.* compatibility updates
= 0.9.12 =
* Minor bug fixes and improvements
= 0.9.11 =
* Multi-currency support (WooCommerce Multilingual and Aelia Currency Switcher)
* Mini-cart widget bug fixes & improvements
= 0.9.10 =
* Improved WPML support
* LTR languages gift carousel css/js bug fixes
= 0.9.9 =
* Product categories condition min amounts and items
* Condition help texts
* Settings fields for cart gift notes
* Minor bug fixes and improvements
= 0.9.8 =
* Order review shipping cost notice bug fix
= 0.9.7 =
* Minor code improvements for better compatibility with other WooCommerce plugins
= 0.9.6 =
* Updated translation strings and German translation
* Minor bug fixes and improvements
= 0.9.5 =
* Bug fix (added some missing files to repository)
= 0.9.4 =
* Full suport for variable products (customers can now select between product variations when choosing a variable product as their gift)
* Downloadable products bug fix (download was not available if awarded as giftable product)
* Minor css bug fixes for better compatibility with various themes
= 0.9.3 =
* Added frontend carousel/button title settings (WooCommerce -> Settings -> Gifts)
* Carousel styling improvements
= 0.9.2 =
* Minor bug fixes and improvements
= 0.9.1 =
* WooCommerce dependency deactivation bug fix
= 0.9.0 =
* Initial public release.
