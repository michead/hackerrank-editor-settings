function camelize(str) {
  const tokens = str.split('-');
  for (let i = 1; i < tokens.length; i++) {
    tokens[i] = tokens[i][0].toUpperCase() + tokens[i].substr(1);
  }
  return tokens.join('');
}

function changeActiveBtn(elemId) {
  $(`#${elemId}`).addClass('active').siblings().removeClass('active');
}

function onBtnClick(evt) {
  const elemId = evt.currentTarget.id;
  const token0 = elemId.substr(elemId.indexOf('-') + 1);
  const token1 = token0.substr(0, token0.lastIndexOf('-'));
  const token2 = parseInt(token0.substr(token0.lastIndexOf('-') + 1));
  
  chrome.storage.sync.set({
    [`hackerRankEditorSettings_${camelize(token1)}`]: token2
  });

  changeActiveBtn(elemId);
}

[
  'group-editor-mode-0',
  'group-editor-mode-1',
  'group-editor-mode-2',
  'group-editor-theme-0',
  'group-editor-theme-1',
  'group-tab-spaces-0',
  'group-tab-spaces-1',
  'group-tab-spaces-2',
  'group-intellisense-0',
  'group-intellisense-1'
].forEach(elemId => {
  document.getElementById(elemId).addEventListener('click', onBtnClick);
});

document.onload = function() {
  chrome.storage.sync.get([
    'hackerRankEditorSettings_editorMode',
    'hackerRankEditorSettings_editorTheme',
    'hackerRankEditorSettings_tabSpaces',
    'hackerRankEditorSettings_intellisense'
  ], function(items) {
    if (typeof items.hackerRankEditorSettings_editorMode === 'number') {
      changeActiveBtn(`group-editor-mode-${items.hackerRankEditorSettings_editorMode}`);
    }
    if (typeof items.hackerRankEditorSettings_editorTheme === 'number') {
      changeActiveBtn(`group-editor-theme-${items.hackerRankEditorSettings_editorTheme}`);
    }
    if (typeof items.hackerRankEditorSettings_tabSpaces === 'number') {
      changeActiveBtn(`group-tab-spaces-${items.hackerRankEditorSettings_tabSpaces}`);
    }
    if (typeof items.hackerRankEditorSettings_intellisense === 'number') {
      changeActiveBtn(`group-intellisense-${items.hackerRankEditorSettings_intellisense}`);
    }
  });
}
