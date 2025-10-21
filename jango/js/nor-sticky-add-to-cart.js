(function (Drupal, once) {
  Drupal.behaviors.norStickyFormat = {
    attach: function (context, settings) {
      // Target the container holding format options
      once('norStickyFormatContainer', '.field--name-field-format', context).forEach(function (container) {

        // Function to update sticky element text
        function updateSticky(selectedEl) {
          const sticky = document.getElementById('nor_sticky_format');
          if (sticky) {
            const text = selectedEl ? selectedEl.textContent.trim() : 'None';
            sticky.textContent = 'Selected: ' + text;
          }
        }

        // Detect initial selected format (if Drupal Commerce adds .selected or checked input)
        const initiallySelected = container.querySelector('.format-row.selected, .format-row.is-active, input:checked + .format-row');
        if (initiallySelected) {
          updateSticky(initiallySelected);
        } else {
          // Fall back to first available format option
          const firstOption = container.querySelector('.format-row');
          if (firstOption) updateSticky(firstOption);
        }

        // Event delegation for clicks on format options
        container.addEventListener('click', function (e) {
          const clicked = e.target.closest('.format-row');
          if (!clicked) return;

          // Remove 'selected' class from others
          container.querySelectorAll('.format-row').forEach(function (item) {
            item.classList.remove('selected');
          });

          // Add 'selected' class to clicked
          clicked.classList.add('selected');

          // Update sticky element
          updateSticky(clicked);
        });

      });
    }
  };
})(Drupal, once);



// (function ($, Drupal) {
//   Drupal.behaviors.stickyAddToCart = {
//     attach: function (context, settings) {
//       console.log('✅ stickyAddToCart behavior attached');
//       const $mainNav = $('#nor_norproduct_doc_nav_tabs', context);
//       const $addToCart = $('#sticky-addtocart', context);

//       if ($mainNav.length && !$addToCart.hasClass('sticky-initialized')) {
//         console.log('✅ Main nav and sticky bar found');
//         $addToCart.addClass('sticky-initialized');

//         $(window).on('scroll.stickyAddToCart', function () {
//           const navTop = $mainNav[0].getBoundingClientRect().top;
//           console.log('scrollY:', window.scrollY, 'navTop:', navTop);

//           if (navTop <= 230) {
//             if (!$addToCart.hasClass('active')) console.log('📌 Activating sticky bar');
//             $addToCart.addClass('active');
//           } else {
//             if ($addToCart.hasClass('active')) console.log('📴 Deactivating sticky bar');
//             $addToCart.removeClass('active');
//           }
//         });
//       } else {
//         console.warn('⚠️ stickyAddToCart: Missing mainNav or sticky bar');
//       }
//     }
//   };
// })(jQuery, Drupal);


// (function ($, Drupal) {
//   Drupal.behaviors.stickyAddToCartEnhanced = {
//     attach: function (context, settings) {
//       console.log('✅ stickyAddToCartEnhanced behavior attached');
//       const $stickyBar = $('#sticky-addtocart', context);
//       const $form = $('#commerce-product-add-to-cart-form', context);

//       if (!$stickyBar.length || !$form.length) {
//         console.warn('⚠️ Missing sticky bar or form element');
//         return;
//       }

//       if ($stickyBar.data('sticky-attached')) {
//         console.log('⚠️ Behavior already attached once');
//         return;
//       }
//       $stickyBar.data('sticky-attached', true);

//       const observer = new IntersectionObserver(entries => {
//         entries.forEach(entry => {
//           console.log('👀 Form visibility:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
//           if (entry.intersectionRatio === 0) {
//             moveToSticky();
//           } else {
//             moveBack();
//           }
//         });
//       }, { threshold: [0, 1] });

//       observer.observe($form[0]);

//       // Cache elements
//       const $title = $('#desktop-title .field__item', context);
//       const $sku = $('.product--variation-field--variation_sku__279', context);
//       const $price = $('.product--variation-field--variation_price__279', context);
//       const $format = $('#edit-purchased-entity-0-attributes-attribute-format--wrapper', context);
//       const $size = $('#edit-purchased-entity-0-attributes-attribute-size--wrapper', context);
//       const $qty = $('#edit-quantity-wrapper', context);
//       const $btn = $('#edit-submit--4', context);

//       if (!($title.length && $sku.length && $price.length && $format.length && $size.length && $qty.length && $btn.length)) {
//         console.warn('⚠️ Some expected elements were not found. Check selectors.');
//       }

//       const $inner = $('<div class="sticky-cart-inner"></div>');
//       const placeholders = {
//         title: $('<div class="sticky-title"></div>'),
//         sku: $('<div class="sticky-sku"></div>'),
//         price: $('<div class="sticky-price"></div>'),
//         format: $('<div class="sticky-format"></div>'),
//         size: $('<div class="sticky-size"></div>'),
//         qty: $('<div class="sticky-qty"></div>'),
//         btn: $('<div class="sticky-btn"></div>'),
//       };

//       $inner.append(
//         placeholders.title,
//         placeholders.format,
//         placeholders.size,  
//         placeholders.price,
//         placeholders.qty,
//         placeholders.btn,
//         placeholders.sku
//       );

//       let inSticky = false;

//       function moveToSticky() {
//         if (inSticky) return;
//         console.log('📦 Moving form to sticky');
//         inSticky = true;
//         $stickyBar.append($inner);
//         $stickyBar.addClass('active');

//         placeholders.title.append($title);
//         placeholders.sku.append($sku);
//         placeholders.price.append($price);
//         placeholders.format.append($format);
//         placeholders.size.append($size);
//         placeholders.qty.append($qty);
//         placeholders.btn.append($btn);
//       }

//       function moveBack() {
//         if (!inSticky) return;
//         console.log('↩️ Moving form back to original');
//         inSticky = false;
//         $stickyBar.removeClass('active');
//         $inner.detach();

//         $('#desktop-title').append($title);
//         $('.product_variation_sku_wrapper').append($sku);
//         $('.c-product-price').append($price);
//         $('#edit-purchased-entity-wrapper').append($format, $size);
//         $('#edit-quantity-wrapper').parent().append($qty);
//         $('#edit-actions--4').append($btn);
//       }
//     }
//   };
// })(jQuery, Drupal);

// // to make the sticky add to cart bar appear when scrolling past the original add to cart form
// (function ($, Drupal) {
//   Drupal.behaviors.stickyProductForm = {
//     attach: function (context, settings) {
//       const $wrapper = $('#sticky-form-wrapper', context);
//       if (!$wrapper.length || $wrapper.data('sticky-attached')) return;

//       $wrapper.data('sticky-attached', true);

//       const $window = $(window);
//       const wrapperOffset = $wrapper.offset().top;

//       $window.on('scroll.stickyProductForm', function () {
//         const scrollTop = $window.scrollTop();

//         // When the wrapper scrolls to the top of the viewport
//         if (scrollTop >= wrapperOffset) {
//           $wrapper.addClass('is-sticky visible');
//         } else {
//           $wrapper.removeClass('is-sticky visible');
//         }
//       });
//     }
//   };
// })(jQuery, Drupal);


// // Toggle display of format and size fieldsets
// (function (Drupal, once) {
//   Drupal.behaviors.norStickyToggles = {
//     attach: function (context) {
//       once('norStickyToggles', 'body', context).forEach(function () {

//         const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
//         const stickyParent = document.querySelector('.is-sticky.visible');

//         console.log('[norStickyToggles] Initializing...');
//         console.log('[norStickyToggles] Media OK:', mediaOK);
//         console.log('[norStickyToggles] Sticky Parent Found:', !!stickyParent);

//         if (!mediaOK || !stickyParent) {
//           console.log('[norStickyToggles] Conditions not met, skipping.');
//           return;
//         }

//         const formatToggle = document.getElementById('nor_sticky_format');
//         const sizeToggle = document.getElementById('nor_sticky_size');
//         const formatFieldset = document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-format--wrapper"]');
//         const sizeFieldset = document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-size--wrapper"]');

//         console.log('[norStickyToggles] Found elements:', {
//           formatToggle: !!formatToggle,
//           sizeToggle: !!sizeToggle,
//           formatFieldset: !!formatFieldset,
//           sizeFieldset: !!sizeFieldset
//         });

//         const toggleFieldset = (target, other, label) => {
//           if (!target) return;

//           const isOpen = target.style.display === 'block';
//           target.style.display = isOpen ? 'none' : 'block';
//           if (other) other.style.display = 'none';
//           console.log(`[norStickyToggles] Toggled ${label}:`, isOpen ? 'Closed' : 'Opened');
//         };

//         // Initially hide both
//         if (formatFieldset) {
//           formatFieldset.style.display = 'none';
//           console.log('[norStickyToggles] Hiding format fieldset initially');
//         }
//         if (sizeFieldset) {
//           sizeFieldset.style.display = 'none';
//           console.log('[norStickyToggles] Hiding size fieldset initially');
//         }

//         // Add listeners
//         if (formatToggle && formatFieldset) {
//           formatToggle.addEventListener('click', () => toggleFieldset(formatFieldset, sizeFieldset, 'Format'));
//         }

//         if (sizeToggle && sizeFieldset) {
//           sizeToggle.addEventListener('click', () => toggleFieldset(sizeFieldset, formatFieldset, 'Size'));
//         }

//         console.log('[norStickyToggles] Behavior attached successfully.');
//       });
//     }
//   };
// })(Drupal, once);


(function ($, Drupal, once) {
  Drupal.behaviors.stickyProductForm = {
    attach: function (context) {
      once('stickyProductForm', 'body', context).forEach(function () {

        const $wrapper = $('#sticky-form-wrapper', context);
        if (!$wrapper.length || $wrapper.data('sticky-attached')) return;

        $wrapper.data('sticky-attached', true);
        const $window = $(window);
        const wrapperOffset = $wrapper.offset().top;

        // Elements for format/size toggles
        const formatToggle = document.getElementById('nor_sticky_format');
        const sizeToggle = document.getElementById('nor_sticky_size');
        const formatFieldset = document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-format"]');
        const sizeFieldset = document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-size"]');

        console.log(sizeFieldset);
        // Helper to toggle fieldsets
        const toggleFieldset = (target, other, label) => {
          if (!target) return;
          const isOpen = target.style.display === 'block';
          target.style.display = isOpen ? 'none' : 'block';
          if (other) other.style.display = 'none';
          console.log(`[norStickyToggles] ${label} ${isOpen ? 'Closed' : 'Opened'}`);
        };

        // // Hide fieldsets initially
        // if (formatFieldset) formatFieldset.style.display = 'none';
        // if (sizeFieldset) sizeFieldset.style.display = 'none';

        // Add scroll listener for sticky bar
        $window.on('scroll.stickyProductForm', function () {
          const scrollTop = $window.scrollTop();
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;

          if (scrollTop >= wrapperOffset && mediaOK) {
            if (!$wrapper.hasClass('is-sticky visible')) {
              $wrapper.addClass('is-sticky visible');
              console.log('[stickyProductForm] Sticky bar activated');
              if (formatFieldset) formatFieldset.style.display = 'none';
              if (sizeFieldset) sizeFieldset.style.display = 'none';
            }
          } else {
            if ($wrapper.hasClass('is-sticky visible')) {
              $wrapper.removeClass('is-sticky visible');
              console.log('[stickyProductForm] Sticky bar deactivated');

              // Close fieldsets when hiding sticky
              if (formatFieldset) formatFieldset.style.display = 'block';
              if (sizeFieldset) sizeFieldset.style.display = 'block';
            }
          }
        });

        // Add click listeners (they only work if sticky bar is visible)
        const handleToggle = (fieldset, other, label) => {
          const stickyVisible = $wrapper.hasClass('is-sticky visible');
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;

          if (stickyVisible && mediaOK) {
            toggleFieldset(fieldset, other, label);
          } else {
            console.log(`[norStickyToggles] Ignored ${label} click — conditions not met`);
          }
        };

        if (formatToggle && formatFieldset) {
          formatToggle.addEventListener('click', () => handleToggle(formatFieldset, sizeFieldset, 'Format'));
        }

        if (sizeToggle && sizeFieldset) {
          sizeToggle.addEventListener('click', () => handleToggle(sizeFieldset, formatFieldset, 'Size'));
        }

        console.log('[stickyProductForm] Behavior attached successfully.');
      });
    }
  };
})(jQuery, Drupal, once);
