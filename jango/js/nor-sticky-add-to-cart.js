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
          const formatText = getSelectedFormat();
          const sizeText = getSelectedSize();

          if (formatDiv) {
            if (formatText === 'None') {
              formatDiv.style.display = 'none';
            } else {
              formatDiv.style.display = '';
              formatDiv.textContent = ' ' + formatText;
            }
          }

          if (sizeDiv) {
            if (sizeText === 'None') {
              sizeDiv.style.display = 'none';
            } else {
              sizeDiv.style.display = '';
              sizeDiv.textContent = ' ' + sizeText;
            }
          }
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

        const $header = $('header.c-layout-header.c-layout-header-4.c-layout-header-light-mobile.c-layout-header-default-mobile');
        const $lastChild = $header.children().last();

        if ($lastChild.prop('tagName').toLowerCase() === 'section') {
          $wrapper.addClass('nor-prod-international');
        }

        let wrapperOffset = $wrapper.offset().top;
        let wrapperHeight = $wrapper.outerHeight();
        // let navigationHeight = $('header .c-navbar').outerHeight();
        let navigationHeight = $('header.c-layout-header.c-layout-header-4.c-layout-header-light-mobile.c-layout-header-default-mobile')
  .children().last()
  .outerHeight();


        function getFormatFieldset() {
          return document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-format"]');
        }
        function getSizeFieldset() {
          return document.querySelector('[data-drupal-selector="edit-purchased-entity-0-attributes-attribute-size"]');
        }

        const formatToggle = document.getElementById('nor_sticky_format');
        const sizeToggle = document.getElementById('nor_sticky_size');

        function saveOpenState(type) {
          sessionStorage.setItem('sticky_open_fieldset', type);
        }

        function restoreOpenState() {
          // console.log('restoreOpenState');
          const saved = sessionStorage.getItem('sticky_open_fieldset');
          // console.log(saved);
          const stickyVisible = $wrapper.hasClass('is-sticky visible');
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
          if (!stickyVisible || !mediaOK || !saved) return;

          const f = getFormatFieldset();
          const s = getSizeFieldset();
          const stickyContainer = document.querySelector('#sticky-form-wrapper.is-sticky.visible .c-product-meta'); /* Added by Liam :D */

          if (saved === 'format' && f) {
            f.classList.add('open');
            const stickyRect = formatToggle.getBoundingClientRect();
            f.style.left = `${stickyRect.left - stickyContainer.getBoundingClientRect().left}px`;
          } else if (saved === 'size' && s) {
            s.classList.add('open');
            const stickyRect = sizeToggle.getBoundingClientRect();
            s.style.left = `${stickyRect.left - stickyContainer.getBoundingClientRect().left}px`;
          }
        }

        const toggleFieldset = (targetFieldset, otherFieldset, target_sticky_field) => {
          if (!targetFieldset) return;
          const wasOpen = targetFieldset.classList.contains('open');

          if (otherFieldset && otherFieldset.classList.contains('open')) {
            otherFieldset.classList.remove('open');
          }

          if (wasOpen) 
          {
            targetFieldset.classList.remove('open');
            sessionStorage.removeItem('sticky_open_fieldset');
          } 
          else 
          {
            targetFieldset.classList.add('open');
            var target_sticky_field_element = sizeToggle;
            let type = 'size';
            if (target_sticky_field == 1) 
            {
              target_sticky_field_element = formatToggle;
              type = 'format';
            } 
            const stickyRect = target_sticky_field_element.getBoundingClientRect();
            const stickyContainer = document.querySelector('#sticky-form-wrapper.is-sticky.visible .c-product-meta'); /* Added by Liam :D */

            targetFieldset.style.left = `${stickyRect.left - stickyContainer.getBoundingClientRect().left}px`;
            saveOpenState(type);
          }
        };

        document.addEventListener('click', function (e) {
          const wrapper = document.querySelector('#sticky-form-wrapper.is-sticky.visible');
          if (!wrapper) return;

          const f = getFormatFieldset();
          const s = getSizeFieldset();
          const formatToggle = document.getElementById('nor_sticky_format');
          const sizeToggle = document.getElementById('nor_sticky_size');

          if (!(f && f.classList.contains('open')) && !(s && s.classList.contains('open'))) return;

          if ((f && f.contains(e.target)) || (s && s.contains(e.target)) ||
              (formatToggle && formatToggle.contains(e.target)) ||
              (sizeToggle && sizeToggle.contains(e.target))) return;

          if (f) f.classList.remove('open');
          if (s) s.classList.remove('open');
          sessionStorage.removeItem('sticky_open_fieldset');
        }, true);


        $window.on('resize.stickyProductForm', function () {
          if ($wrapper.hasClass('is-sticky visible')) {
            const f = getFormatFieldset();
            const s = getSizeFieldset();
            const stickyContainer = document.querySelector('#sticky-form-wrapper.is-sticky.visible .c-product-meta'); /* Added by Liam :D */

            if (f && f.classList.contains('open')) f.style.left = `${formatToggle.getBoundingClientRect().left - stickyContainer.getBoundingClientRect().left}px`;
            if (s && s.classList.contains('open')) s.style.left = `${sizeToggle.getBoundingClientRect().left - stickyContainer.getBoundingClientRect().left}px`;
          }
        });

        $window.on('scroll.stickyProductForm', function () {
          const scrollTop = $window.scrollTop();
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;

          if (scrollTop >= (wrapperOffset + wrapperHeight - navigationHeight) && mediaOK) { /* added wrapperHeight and navigationHeight as part of calculation - Liam :D */
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
              toggleFieldset(getFormatFieldset(), getSizeFieldset(), 1);
            } 
          });
        }

        if (sizeToggle) {
          sizeToggle.addEventListener('click', function () {
            const stickyVisible = $wrapper.hasClass('is-sticky visible');
            const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
            if (stickyVisible && mediaOK) {
              toggleFieldset(getSizeFieldset(), getFormatFieldset(), 2);
            } 
          });
        }

        /* $(document).ajaxComplete(function () {
          setTimeout(() => {
            restoreOpenState();
          }, 200); 
        });

        setTimeout(() => restoreOpenState(), 200); */

        (function recheckStickyState() {
          const scrollTop = $window.scrollTop();
          const mediaOK = window.matchMedia('(min-width: 1024px)').matches;
          if (scrollTop >= wrapperOffset && mediaOK) {
            $wrapper.addClass('is-sticky visible');
          } else {
            $wrapper.removeClass('is-sticky visible');
          }
        })();

        
        $(document).on('ajaxSend', function () {
          $wrapper.addClass('ajax-refreshing');
        });

        
       $(document).on('ajaxComplete', function () {
          restoreOpenState();
          setTimeout(() => $wrapper.removeClass('ajax-refreshing'), 50);
        });


      });
    }
  };
})(jQuery, Drupal, once);
