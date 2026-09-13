// Chicken Eye - Minimalist Password Visibility Toggle
// Content Script

(function () {
  'use strict';

  function getEyeSvg(size) {
    return `<svg class="chicken-eye-svg" style="width:${size}px;height:${size}px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>`;
  }

  function getEyeOffSvg(size) {
    return `<svg class="chicken-eye-svg" style="width:${size}px;height:${size}px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>`;
  }

  let isEnabled = true;
  const trackedInputs = new Map(); // input element -> { button, observer, originalPadding, currentSize }

  // Load extension state
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({ enabled: true }, (items) => {
      isEnabled = items.enabled !== false;
      refreshAll();
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && changes.enabled) {
        isEnabled = changes.enabled.newValue !== false;
        refreshAll();
      }
    });
  }

  function hasNativeOrCustomToggle(input) {
    if (input.dataset.chickenEyeIgnore === 'true') return true;

    // Check sibling elements
    const siblings = Array.from(input.parentNode ? input.parentNode.children : []);
    for (const sibling of siblings) {
      if (sibling === input || sibling.classList.contains('chicken-eye-toggle')) continue;
      
      const tag = sibling.tagName.toLowerCase();
      const aria = (sibling.getAttribute('aria-label') || '').toLowerCase();
      const title = (sibling.getAttribute('title') || '').toLowerCase();
      const className = (typeof sibling.className === 'string' ? sibling.className : '').toLowerCase();

      const isToggleCandidate =
        tag === 'button' ||
        tag === 'svg' ||
        sibling.querySelector('button, svg, i, span[class*="icon" i], span[class*="eye" i]');

      if (isToggleCandidate) {
        const keywords = ['toggle', 'reveal', 'show', 'hide', 'password', 'visibility', 'eye', 'pass'];
        const matchesKeyword = keywords.some(
          (kw) => aria.includes(kw) || title.includes(kw) || className.includes(kw)
        );
        if (matchesKeyword) return true;
      }
    }

    // Check parent and grandparent container attributes
    let parent = input.parentElement;
    let depth = 0;
    while (parent && depth < 3) {
      const parentClass = (typeof parent.className === 'string' ? parent.className : '').toLowerCase();
      if (
        parentClass.includes('password-toggle') ||
        parentClass.includes('password-reveal') ||
        parentClass.includes('show-password') ||
        parentClass.includes('hide-password') ||
        parentClass.includes('toggle-password')
      ) {
        if (parent.querySelector('button:not(.chicken-eye-toggle), svg:not(.chicken-eye-svg), [role="button"]')) {
          return true;
        }
      }
      parent = parent.parentElement;
      depth++;
    }

    return false;
  }

  function calculateIconSize(style, height) {
    const fontSize = parseFloat(style.fontSize) || 14;
    // Scale proportionally with font size and input height
    const sizeFromFont = Math.round(fontSize * 1.1);
    const sizeFromHeight = Math.round(height * 0.42);
    const targetSize = Math.max(13, Math.min(24, Math.min(sizeFromFont, sizeFromHeight)));
    return targetSize;
  }

  function updatePosition(input, tracked) {
    const { button } = tracked;
    if (!isEnabled || !input.isConnected) {
      button.style.display = 'none';
      return;
    }

    const rect = input.getBoundingClientRect();
    const style = window.getComputedStyle(input);

    if (
      rect.width === 0 ||
      rect.height === 0 ||
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      parseFloat(style.opacity) === 0
    ) {
      button.style.display = 'none';
      return;
    }

    const iconSize = calculateIconSize(style, rect.height);
    const buttonWidth = Math.max(28, iconSize + 12);
    const borderRight = parseFloat(style.borderRightWidth) || 0;

    // Update SVG size if scaled
    if (tracked.currentSize !== iconSize) {
      tracked.currentSize = iconSize;
      const isShowingText = input.type === 'text';
      button.innerHTML = isShowingText ? getEyeOffSvg(iconSize) : getEyeSvg(iconSize);
    }

    // Exact vertical centering by spanning the exact input height with flexbox alignment
    const top = window.scrollY + rect.top;
    const rightOffset = Math.max(4, 6 + borderRight);
    const left = window.scrollX + rect.right - buttonWidth - rightOffset;

    button.style.top = `${top}px`;
    button.style.left = `${left}px`;
    button.style.width = `${buttonWidth}px`;
    button.style.height = `${rect.height}px`;
    button.style.display = 'inline-flex';
  }

  function setupInput(input) {
    if (trackedInputs.has(input)) return;
    if (input.type !== 'password' && !input.dataset.chickenEyeTracked) return;
    if (hasNativeOrCustomToggle(input)) return;

    input.dataset.chickenEyeTracked = 'true';

    const style = window.getComputedStyle(input);
    const rect = input.getBoundingClientRect();
    const iconSize = calculateIconSize(style, rect.height || 40);

    // Create toggle button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chicken-eye-toggle';
    button.setAttribute('aria-label', 'Show password');
    button.setAttribute('tabindex', '-1');
    button.innerHTML = getEyeSvg(iconSize);

    // Prevent button click from causing input blur or form submit
    button.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isPassword = input.type === 'password';
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;
      const currentSize = trackedInputs.get(input)?.currentSize || iconSize;

      if (isPassword) {
        input.type = 'text';
        button.innerHTML = getEyeOffSvg(currentSize);
        button.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        button.innerHTML = getEyeSvg(currentSize);
        button.setAttribute('aria-label', 'Show password');
      }

      // Maintain cursor position & focus
      if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
        try {
          input.setSelectionRange(selectionStart, selectionEnd);
        } catch (_) {}
      }
      input.focus();
    });

    // Ensure input has enough right padding so text does not overlap icon
    const currentPaddingRight = parseFloat(style.paddingRight) || 0;
    const buttonWidth = Math.max(28, iconSize + 12);
    let originalPadding = null;
    if (currentPaddingRight < buttonWidth + 6) {
      originalPadding = input.style.paddingRight;
      input.style.paddingRight = `${buttonWidth + 8}px`;
    }

    // Append button to document
    document.documentElement.appendChild(button);

    // Watch for size/position changes
    let resizeObserver = null;
    const tracked = { button, resizeObserver: null, originalPadding, currentSize: iconSize };

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updatePosition(input, tracked);
      });
      resizeObserver.observe(input);
      tracked.resizeObserver = resizeObserver;
    }

    trackedInputs.set(input, tracked);

    updatePosition(input, tracked);

    // Form submit listener to restore password type if needed
    if (input.form) {
      input.form.addEventListener('submit', () => {
        if (input.type === 'text' && input.dataset.chickenEyeTracked) {
          input.type = 'password';
          button.innerHTML = getEyeSvg(tracked.currentSize || iconSize);
          button.setAttribute('aria-label', 'Show password');
        }
      });
    }
  }

  function removeInput(input) {
    const tracked = trackedInputs.get(input);
    if (!tracked) return;

    if (tracked.button && tracked.button.parentNode) {
      tracked.button.parentNode.removeChild(tracked.button);
    }
    if (tracked.resizeObserver) {
      tracked.resizeObserver.disconnect();
    }
    if (tracked.originalPadding !== null) {
      input.style.paddingRight = tracked.originalPadding;
    }
    delete input.dataset.chickenEyeTracked;
    trackedInputs.delete(input);
  }

  function scanDOM() {
    if (!isEnabled) return;
    const inputs = document.querySelectorAll('input[type="password"]');
    inputs.forEach((input) => setupInput(input));
  }

  function refreshAll() {
    if (!isEnabled) {
      trackedInputs.forEach(({ button }) => {
        button.style.display = 'none';
      });
    } else {
      trackedInputs.forEach((tracked, input) => {
        if (!input.isConnected) {
          removeInput(input);
        } else {
          updatePosition(input, tracked);
        }
      });
      scanDOM();
    }
  }

  // Reposition on scroll / resize / focus
  let rafId = null;
  function scheduleReposition() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      trackedInputs.forEach((tracked, input) => {
        if (input.isConnected) {
          updatePosition(input, tracked);
        } else {
          removeInput(input);
        }
      });
    });
  }

  window.addEventListener('scroll', scheduleReposition, { passive: true });
  window.addEventListener('resize', scheduleReposition, { passive: true });
  document.addEventListener('focusin', scheduleReposition, { passive: true });

  // MutationObserver for dynamic SPAs and form renders
  const mutationObserver = new MutationObserver((mutations) => {
    if (!isEnabled) return;

    let shouldScan = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'INPUT' && node.type === 'password') {
              shouldScan = true;
            } else if (node.querySelector && node.querySelector('input[type="password"]')) {
              shouldScan = true;
            }
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'INPUT' && trackedInputs.has(node)) {
              removeInput(node);
            } else if (node.querySelectorAll) {
              node.querySelectorAll('input').forEach((input) => {
                if (trackedInputs.has(input)) removeInput(input);
              });
            }
          }
        });
      } else if (mutation.type === 'attributes' && mutation.attributeName === 'type') {
        const target = mutation.target;
        if (target.tagName === 'INPUT') {
          if (target.type === 'password') {
            shouldScan = true;
          } else if (!target.dataset.chickenEyeTracked && trackedInputs.has(target)) {
            removeInput(target);
          }
        }
      }
    }

    if (shouldScan) {
      scanDOM();
    }
  });

  function init() {
    scanDOM();
    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['type', 'style', 'class']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
