(function ($, Drupal) {
  Drupal.behaviors.stickyAddToCart = {
    attach: function (context, settings) {
      console.log('✅ stickyAddToCart behavior attached');
      const $mainNav = $('#nor_norproduct_doc_nav_tabs', context);
      const $addToCart = $('#sticky-addtocart', context);

      if ($mainNav.length && !$addToCart.hasClass('sticky-initialized')) {
        console.log('✅ Main nav and sticky bar found');
        $addToCart.addClass('sticky-initialized');

        $(window).on('scroll.stickyAddToCart', function () {
          const navTop = $mainNav[0].getBoundingClientRect().top;
          console.log('scrollY:', window.scrollY, 'navTop:', navTop);

          if (navTop <= 230) {
            if (!$addToCart.hasClass('active')) console.log('📌 Activating sticky bar');
            $addToCart.addClass('active');
          } else {
            if ($addToCart.hasClass('active')) console.log('📴 Deactivating sticky bar');
            $addToCart.removeClass('active');
          }
        });
      } else {
        console.warn('⚠️ stickyAddToCart: Missing mainNav or sticky bar');
      }
    }
  };
})(jQuery, Drupal);


(function ($, Drupal) {
  Drupal.behaviors.stickyAddToCartEnhanced = {
    attach: function (context, settings) {
      console.log('✅ stickyAddToCartEnhanced behavior attached');
      const $stickyBar = $('#sticky-addtocart', context);
      const $form = $('#commerce-product-add-to-cart-form', context);

      if (!$stickyBar.length || !$form.length) {
        console.warn('⚠️ Missing sticky bar or form element');
        return;
      }

      if ($stickyBar.data('sticky-attached')) {
        console.log('⚠️ Behavior already attached once');
        return;
      }
      $stickyBar.data('sticky-attached', true);

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          console.log('👀 Form visibility:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
          if (entry.intersectionRatio === 0) {
            moveToSticky();
          } else {
            moveBack();
          }
        });
      }, { threshold: [0, 1] });

      observer.observe($form[0]);

      // Cache elements
      const $title = $('#desktop-title .field__item', context);
      const $sku = $('.product--variation-field--variation_sku__279', context);
      const $price = $('.product--variation-field--variation_price__279', context);
      const $format = $('#edit-purchased-entity-0-attributes-attribute-format--wrapper', context);
      const $size = $('#edit-purchased-entity-0-attributes-attribute-size--wrapper', context);
      const $qty = $('#edit-quantity-wrapper', context);
      const $btn = $('#edit-submit--4', context);

      if (!($title.length && $sku.length && $price.length && $format.length && $size.length && $qty.length && $btn.length)) {
        console.warn('⚠️ Some expected elements were not found. Check selectors.');
      }

      const $inner = $('<div class="sticky-cart-inner"></div>');
      const placeholders = {
        title: $('<div class="sticky-title"></div>'),
        sku: $('<div class="sticky-sku"></div>'),
        price: $('<div class="sticky-price"></div>'),
        format: $('<div class="sticky-format"></div>'),
        size: $('<div class="sticky-size"></div>'),
        qty: $('<div class="sticky-qty"></div>'),
        btn: $('<div class="sticky-btn"></div>'),
      };

      $inner.append(
        placeholders.title,
        placeholders.format,
        placeholders.size,
        placeholders.price,
        placeholders.qty,
        placeholders.btn,
        placeholders.sku
      );

      let inSticky = false;

      function moveToSticky() {
        if (inSticky) return;
        console.log('📦 Moving form to sticky');
        inSticky = true;
        $stickyBar.append($inner);
        $stickyBar.addClass('active');

        placeholders.title.append($title);
        placeholders.sku.append($sku);
        placeholders.price.append($price);
        placeholders.format.append($format);
        placeholders.size.append($size);
        placeholders.qty.append($qty);
        placeholders.btn.append($btn);
      }

      function moveBack() {
        if (!inSticky) return;
        console.log('↩️ Moving form back to original');
        inSticky = false;
        $stickyBar.removeClass('active');
        $inner.detach();

        $('#desktop-title').append($title);
        $('.product_variation_sku_wrapper').append($sku);
        $('.c-product-price').append($price);
        $('#edit-purchased-entity-wrapper').append($format, $size);
        $('#edit-quantity-wrapper').parent().append($qty);
        $('#edit-actions--4').append($btn);
      }
    }
  };
})(jQuery, Drupal);
