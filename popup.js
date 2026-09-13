// Chicken Eye - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggle-switch');
  const statusText = document.getElementById('status-text');

  function updateStatus(enabled) {
    if (enabled) {
      statusText.textContent = 'Active on password fields';
    } else {
      statusText.textContent = 'Disabled';
    }
  }

  // Load current setting
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({ enabled: true }, (items) => {
      const enabled = items.enabled !== false;
      toggleSwitch.checked = enabled;
      updateStatus(enabled);
    });

    toggleSwitch.addEventListener('change', () => {
      const enabled = toggleSwitch.checked;
      chrome.storage.sync.set({ enabled }, () => {
        updateStatus(enabled);
      });
    });
  } else {
    toggleSwitch.addEventListener('change', () => {
      updateStatus(toggleSwitch.checked);
    });
  }
});
