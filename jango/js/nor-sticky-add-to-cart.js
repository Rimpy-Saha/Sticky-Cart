// (function (Drupal, once) {
//   Drupal.behaviors.norStickyFormat = {
//     attach: function (context, settings) {
//       // Target the container holding format options
//       once('norStickyFormatContainer', '.field--name-field-format', context).forEach(function (container) {

//         // Function to update sticky element text
//         function updateSticky(selectedEl) {
//           const sticky = document.getElementById('nor_sticky_format');
//           if (sticky) {
//             const text = selectedEl ? selectedEl.textContent.trim() : 'None';
//             sticky.textContent = 'Selected: ' + text;
//           }
//         }

//         // Detect initial selected format (if Drupal Commerce adds .selected or checked input)
//         const initiallySelected = container.querySelector('.format-row.selected, .format-row.is-active, input:checked + .format-row');
//         if (initiallySelected) {
//           updateSticky(initiallySelected);
//         } else {
//           // Fall back to first available format option
//           const firstOption = container.querySelector('.format-row');
//           if (firstOption) updateSticky(firstOption);
//         }

//         // Event delegation for clicks on format options
//         container.addEventListener('click', function (e) {
//           const clicked = e.target.closest('.format-row');
//           if (!clicked) return;

//           // Remove 'selected' class from others
//           container.querySelectorAll('.format-row').forEach(function (item) {
//             item.classList.remove('selected');
//           });

//           // Add 'selected' class to clicked
//           clicked.classList.add('selected');

//           // Update sticky element
//           updateSticky(clicked);
//         });

//       });
//     }
//   };
// })(Drupal, once);

(function (Drupal, once) {
  Drupal.behaviors.norStickyLabels = {
    attach: function (context, settings) {

      once('norStickyLabels', '#nor_sticky_format,#nor_sticky_size', context).forEach(function () {

        // Generic helper: get the label text for any attribute (format, size, etc.)
        function getSelectedLabelText(attributeSelector) {
          console.log(attributeSelector + "input:checked");
          let checked = document.querySelector(`${attributeSelector} input:checked`);

          // Fallback for cases like size (where selection is tracked by a class)
          if (!checked) {
            const selectedWrapper = document.querySelector(`${attributeSelector} input.product--rendered-attribute__selected`);
            console.log("selectedWrapper");
            console.log(selectedWrapper);
            if (selectedWrapper) {             
                checked = selectedWrapper;
            }
              
          }
          if (!checked) return 'None';

          const label = document.querySelector(`label[for="${checked.id}"] .field__item`);
          if (!label) return 'None';

          console.log(checked);
          console.log(attributeSelector + "input:checked");
          return label.textContent.trim();
        }

        // Specific helpers for format and size
        function getSelectedFormat() {
          
          console.log("getSelectedFormat");
          return getSelectedLabelText('[data-drupal-selector^="edit-purchased-entity-0-attributes-attribute-format"]');
        }

        function getSelectedSize() {
          
          console.log("getSelectedSize");
          return getSelectedLabelText('[data-drupal-selector^="edit-purchased-entity-0-attributes-attribute-size"]');
        }

        // Sticky label divs
        const formatDiv = document.getElementById('nor_sticky_format');
        const sizeDiv = document.getElementById('nor_sticky_size');

        // Update both labels
        function updateLabels() {
          console.log("to update both labels");
          if (formatDiv) formatDiv.textContent = ' ' + getSelectedFormat();
          if (sizeDiv) sizeDiv.textContent = ' ' + getSelectedSize();
        }

        // Initial update after DOM is ready
        setTimeout(updateLabels, 300);

        // Attribute containers
        const containerSelectors = [
          '[data-drupal-selector^="edit-purchased-entity-0-attributes-attribute-format"]',
          '[data-drupal-selector^="edit-purchased-entity-0-attributes-attribute-size"]'
        ];

        // Listen for user interactions
        containerSelectors.forEach(selector => {
          const container = document.querySelector(selector);
          if (!container) return;

          container.addEventListener('click', function (e) {
            const option = e.target.closest('label.option');
            if (!option) return;
            updateLabels();
          });
        });

        // Update after AJAX reload (e.g., Commerce variation switch)
        $(document).ajaxComplete(function () {
          updateLabels();
        });

      });
    }
  };
})(Drupal, once);

(function ($, Drupal, once) {
  Drupal.behaviors.stickyProductForm = {
    attach: function (context) {
      once('stickyProductForm', '#sticky-form-wrapper', context).forEach(function () {

        const $wrapper = $('#sticky-form-wrapper', context);
        if (!$wrapper.length || $wrapper.data('sticky-attached')) return;

        $wrapper.data('sticky-attached', true);
        const $window = $(window);
        // compute offset relative to document at attach time (recalculate if necessary)
        let wrapperOffset = $wrapper.offset().top;

        // Utility: dynamic accessors - always get current DOM element (AJAX-safe)
        function getFormatFieldset() {
          return document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-format"]');
        }
        function getSizeFieldset() {
          return document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-size"]');
        }

        const formatToggle = document.getElementById('nor_sticky_format');
        const sizeToggle = document.getElementById('nor_sticky_size');

        // Toggle by adding/removing `.open` rather than manipulating style directly.
        const toggleFieldset = (targetFieldset, otherFieldset, label) => {
          if (!targetFieldset) return;
          const wasOpen = targetFieldset.classList.contains('open');

          // Close other one
          if (otherFieldset && otherFieldset.classList.contains('open')) {
            otherFieldset.classList.remove('open');
          }

          if (wasOpen) {
            targetFieldset.classList.remove('open');
            console.log(`[norStickyToggles] ${label} Closed`);
          } else {
            targetFieldset.classList.add('open');
            console.log(`[norStickyToggles] ${label} Opened`);
          }
        };

        // Recompute the wrapper offset on resize or if layout changes (helps reliability)
        $window.on('resize.stickyProductForm', function () {
          wrapperOffset = $wrapper.offset().top;
        });

        // Add scroll listener for sticky bar (same logic as before)
        $window.on('scroll.stickyProductForm', function () {
          const scrollTop = $window.scrollTop();
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;

          if (scrollTop >= wrapperOffset && mediaOK) {
            if (!$wrapper.hasClass('is-sticky visible')) {
              $wrapper.addClass('is-sticky visible');
              // console.log('[stickyProductForm] Sticky bar activated');
              // do NOT set style.display here — CSS controls hiding
              // ensure any open classes are removed by default (so dropdowns stay closed)
              const f = getFormatFieldset();
              const s = getSizeFieldset();
              if (f) f.classList.remove('open');
              if (s) s.classList.remove('open');
            }
          } else {
            if ($wrapper.hasClass('is-sticky visible')) {
              $wrapper.removeClass('is-sticky visible');
              // console.log('[stickyProductForm] Sticky bar deactivated');
              // when leaving sticky, remove any open class so the fieldsets render normally
              const f = getFormatFieldset();
              const s = getSizeFieldset();
              if (f) f.classList.remove('open');
              if (s) s.classList.remove('open');
            }
          }
        });

        // Click handlers use dynamic lookup (AJAX safe)
        if (formatToggle) {
          formatToggle.addEventListener('click', function () {
            // only toggle if sticky & desktop
            const stickyVisible = $wrapper.hasClass('is-sticky visible');
            const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
            if (stickyVisible && mediaOK) {
              toggleFieldset(getFormatFieldset(), getSizeFieldset(), 'Format');
            } else {
              // console.log('[norStickyToggles] Ignored Format click — conditions not met');
            }
          });
        }

        if (sizeToggle) {
          sizeToggle.addEventListener('click', function () {
            const stickyVisible = $wrapper.hasClass('is-sticky visible');
            const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
            if (stickyVisible && mediaOK) {
              toggleFieldset(getSizeFieldset(), getFormatFieldset(), 'Size');
            } else {
              // console.log('[norStickyToggles] Ignored Size click — conditions not met');
            }
          });
        }

        // Immediately re-check sticky state in case user is already scrolled
        (function recheckStickyState() {
          const scrollTop = $window.scrollTop();
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
          if (scrollTop >= wrapperOffset && mediaOK) {
            $wrapper.addClass('is-sticky visible');
          } else {
            $wrapper.removeClass('is-sticky visible');
          }
        })();

        // console.log('[stickyProductForm] Behavior attached successfully.');
      });
    }
  };
})(jQuery, Drupal, once);


