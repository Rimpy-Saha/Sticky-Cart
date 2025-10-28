(function (Drupal, once) {
  Drupal.behaviors.norStickyLabels = {
    attach: function (context, settings) {

      once('norStickyLabels', '#nor_sticky_format,#nor_sticky_size', context).forEach(function () {

        function getSelectedLabelText(attributeSelector) {
          let checked = document.querySelector(`${attributeSelector} input:checked`);

          if (!checked) {
            const selectedWrapper = document.querySelector(`${attributeSelector} input.product--rendered-attribute__selected`);
            if (selectedWrapper) {             
                checked = selectedWrapper;
            }
              
          }
          if (!checked) return 'None';

          const label = document.querySelector(`label[for="${checked.id}"] .field__item`);
          if (!label) return 'None';

          return label.textContent.trim();
        }

        function getSelectedFormat() {
          
          return getSelectedLabelText('[data-drupal-selector^="edit-purchased-entity-0-attributes-attribute-format"]');
        }

        function getSelectedSize() {
          
          return getSelectedLabelText('[data-drupal-selector^="edit-purchased-entity-0-attributes-attribute-size"]');
        }

        const formatDiv = document.getElementById('nor_sticky_format');
        const sizeDiv = document.getElementById('nor_sticky_size');

        function updateLabels() {
          if (formatDiv) formatDiv.textContent = ' ' + getSelectedFormat();
          if (sizeDiv) sizeDiv.textContent = ' ' + getSelectedSize();
        }

        setTimeout(updateLabels, 300);

        const containerSelectors = [
          '[data-drupal-selector^="edit-purchased-entity-0-attributes-attribute-format"]',
          '[data-drupal-selector^="edit-purchased-entity-0-attributes-attribute-size"]'
        ];

        containerSelectors.forEach(selector => {
          const container = document.querySelector(selector);
          if (!container) return;

          container.addEventListener('click', function (e) {
            const option = e.target.closest('label.option');
            if (!option) return;
            updateLabels();
          });
        });

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
        let wrapperOffset = $wrapper.offset().top;

        function getFormatFieldset() {
          return document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-format"]');
        }
        function getSizeFieldset() {
          return document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-size"]');
        }

        const formatToggle = document.getElementById('nor_sticky_format');
        const sizeToggle = document.getElementById('nor_sticky_size');

        const toggleFieldset = (targetFieldset, otherFieldset, label) => {
          if (!targetFieldset) return;
          const wasOpen = targetFieldset.classList.contains('open');

          if (otherFieldset && otherFieldset.classList.contains('open')) {
            otherFieldset.classList.remove('open');
          }

          if (wasOpen) {
            targetFieldset.classList.remove('open');
          } else {
            targetFieldset.classList.add('open');
          }
        };

        $window.on('resize.stickyProductForm', function () {
          wrapperOffset = $wrapper.offset().top;
        });

        $window.on('scroll.stickyProductForm', function () {
          const scrollTop = $window.scrollTop();
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;

          if (scrollTop >= wrapperOffset && mediaOK) {
            if (!$wrapper.hasClass('is-sticky visible')) {
              $wrapper.addClass('is-sticky visible');
              const f = getFormatFieldset();
              const s = getSizeFieldset();
              if (f) f.classList.remove('open');
              if (s) s.classList.remove('open');
            }
          } else {
            if ($wrapper.hasClass('is-sticky visible')) {
              $wrapper.removeClass('is-sticky visible');
              const f = getFormatFieldset();
              const s = getSizeFieldset();
              if (f) f.classList.remove('open');
              if (s) s.classList.remove('open');
            }
          }
        });

        if (formatToggle) {
          formatToggle.addEventListener('click', function () {
            const stickyVisible = $wrapper.hasClass('is-sticky visible');
            const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
            if (stickyVisible && mediaOK) {
              toggleFieldset(getFormatFieldset(), getSizeFieldset(), 'Format');
            } 
          });
        }

        if (sizeToggle) {
          sizeToggle.addEventListener('click', function () {
            const stickyVisible = $wrapper.hasClass('is-sticky visible');
            const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
            if (stickyVisible && mediaOK) {
              toggleFieldset(getSizeFieldset(), getFormatFieldset(), 'Size');
            } 
          });
        }

        (function recheckStickyState() {
          const scrollTop = $window.scrollTop();
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
          if (scrollTop >= wrapperOffset && mediaOK) {
            $wrapper.addClass('is-sticky visible');
          } else {
            $wrapper.removeClass('is-sticky visible');
          }
        })();

      });
    }
  };
})(jQuery, Drupal, once);
(function (Drupal, once) {
  Drupal.behaviors.norStickyDynamicPosition = {
    attach: function (context, settings) {
      once('norStickyDynamicPosition', '#sticky-form-wrapper', context).forEach(function () {

        function positionFieldsetBelow(stickyId, fieldsetSelector) {
          const stickyEl = document.getElementById(stickyId);
          const fieldset = document.querySelector(fieldsetSelector);
          if (!stickyEl || !fieldset) return;

          const rect = stickyEl.getBoundingClientRect();

          fieldset.style.position = 'absolute';
          fieldset.style.left = `${rect.left}px`;
          console.log( `${rect.left}px`);
          fieldset.style.zIndex = 1100;
        }

        function updatePositions() {
          positionFieldsetBelow(
            'nor_sticky_format',
            '#sticky-form-wrapper.is-sticky.visible fieldset[id*="attribute-format"]'
          );
          positionFieldsetBelow(
            'nor_sticky_size',
            '#sticky-form-wrapper.is-sticky.visible fieldset[id*="attribute-size"]'
          );
        }

        updatePositions();

        window.addEventListener('resize', updatePositions);
      });
    }
  };
})(Drupal, once);
