function setPrefPaneOpacity(tabId, opacity, cb) {
  let script;
  const attribName = "opacity";
  if (opacity < 1) {
    const attribNameAndVal = `${attribName}:${opacity}`;
    script =`
    var elem = document.getElementById("pref-pane");
    var style = elem.getAttribute("style");
    if (style.indexOf("${attribName}") === -1) {
      elem.setAttribute("style", style.concat("${attribNameAndVal}"));
    }`;
  } else {
    script = `
    var elem = document.getElementById("pref-pane");
    var style = elem.getAttribute("style");
    if (style.indexOf("${attribName}") !== -1) {
      elem.setAttribute("style", style.substr(0, style.indexOf("${attribName}")));
    }`;
  }
  chrome.tabs.executeScript(tabId, {
    code: script
  }, cb);
}

function toggleEditorSettings(tabId, show, cb) {
  let script;
  if (show) {
    script = `if (document.getElementById("pref-pane").getAttribute("style").indexOf("display: none") !== -1) {
      document.getElementById('show-preferences').click();
    }`;
  } else {
    script = `if (document.getElementById("pref-pane").getAttribute("style").indexOf("display: none") === -1) {
      document.getElementById('show-preferences').click();
    }`;
  }
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

function tabChangeListener(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (/^https?:\/\/www\.hackerrank\.com\//.test(tab.url)) {
      setPrefPaneOpacity(tabId, 0.001, () => {
        toggleEditorSettings(tabId, true, () => {
          chrome.storage.sync.get([
            'hackerRankEditorSettings_editorMode',
            'hackerRankEditorSettings_editorTheme',
            'hackerRankEditorSettings_tabSpaces',
            'hackerRankEditorSettings_intellisense'
          ], function(items) {
            clickEditorMode(tabId, items, () => {
              clickEditorTheme(tabId, items, () => {
                clickTabSpaces(tabId, items, () => {
                  clickIntellisense(tabId, items, () => {
                    toggleEditorSettings(tabId, false, () => {
                      setPrefPaneOpacity(tabId, 1, () => {});
                    })
                  });
                });
              });
            });
          });
        });
      });
    }
  });
}

chrome.tabs.onActivated.addListener((tab) => tabChangeListener(tab.tabId));
chrome.tabs.onUpdated.addListener((tabId) => tabChangeListener(tabId));
