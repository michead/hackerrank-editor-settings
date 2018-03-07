function toggleEditorSettings(tabId, show, cb) {
  const neg = show ? '!' : '';
  const script =
  `if (document.getElementById("pref-pane").getAttribute("style").indexOf("display: none") ${neg}== -1) {
    document.getElementById('show-preferences').click();
  }`
  chrome.tabs.executeScript(tabId, {
    code: script
  }, cb);
}

const selectors = {
  hackerRankEditorSettings_editorMode: [
    '.editor-mode-button.emacs',
    '.editor-mode-button.default',
    '.editor-mode-button.vim'
  ],
  hackerRankEditorSettings_editorTheme: [
    '.editor-theme-button.light',
    '.editor-theme-button.dark'
  ],
  hackerRankEditorSettings_tabSpaces: [
    '.editor-tabspace-button[data-attr1="2"]',
    '.editor-tabspace-button[data-attr1="4"]',
    '.editor-tabspace-button[data-attr1="8"]'
  ],
  hackerRankEditorSettings_intellisense: [
    '.editor-autocomplete-button.emacs',
    '.editor-autocomplete-button.default'
  ]
}

function clickSetting(tabId, items, settingName, cb) {
  if (typeof items[`hackerRankEditorSettings_${settingName}`] === 'number') {
    const editorMode = items[`hackerRankEditorSettings_${settingName}`];
    const selector = selectors[`hackerRankEditorSettings_${settingName}`][editorMode];
    chrome.tabs.executeScript(tabId, {
      code: `document.querySelector('${selector}').click();`
    }, cb);
  } else {
    cb();
  }
}

function clickEditorMode(tabId, items, cb) {
  clickSetting(tabId, items, 'editorMode', cb);
}

function clickEditorTheme(tabId, items, cb) {
  clickSetting(tabId, items, 'editorTheme', cb);
}

function clickTabSpaces(tabId, items, cb) {
  clickSetting(tabId, items, 'tabSpaces', cb);
}

function clickIntellisense(tabId, items, cb) {
  clickSetting(tabId, items, 'intellisense', cb);
}

chrome.tabs.onActivated.addListener((_tab) => {
  chrome.tabs.get(_tab.tabId, (tab) => {
    if (/^https?:\/\/www\.hackerrank\.com\//.test(tab.url)) {
      toggleEditorSettings(_tab.tabId, true, () => {
        chrome.storage.sync.get([
          'hackerRankEditorSettings_editorMode',
          'hackerRankEditorSettings_editorTheme',
          'hackerRankEditorSettings_tabSpaces',
          'hackerRankEditorSettings_intellisense'
        ], function(items) {
          clickEditorMode(_tab.tabId, items, () => {
            clickEditorSettings(_tab.tabId, items, () => {
              clickTabSpaces(_tab.tabId, items, () => {
                clickIntellisense(_tab.tabId, items, () => {
                  toggleEditorSettings(_tab.tabId, false, () => {})
                });
              });
            });
          });
        });
      });
    }
  });
});
