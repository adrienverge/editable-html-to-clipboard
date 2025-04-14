/*
 * Copyright (C) 2025 Adrien Vergé
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'contenteditable_to_clipboard',
    title: 'Copy editable HTML to clipboard (Ctrl+.)',
    contexts: ['editable'],
  });
  chrome.contextMenus.create({
    id: 'clipboard_to_contenteditable',
    title: 'Replace editable HTML from clipboard (Ctrl+Shift+.)',
    contexts: ['editable'],
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  runAction(info.menuItemId, tab.id);
});

chrome.commands.onCommand.addListener((command, tab) => {
  runAction(command, tab.id);
});

async function runAction(action, tabId) {
  const scriptsLoaded = await chrome.scripting.executeScript({
    target: {tabId: tabId},
    function: () => { return typeof EditableHtmlToClipboard === 'function'; },
  });
  if (!scriptsLoaded[0].result) {
    await chrome.scripting.insertCSS({
      target: {tabId},
      files: ['content.css'],
    });
    await chrome.scripting.executeScript({
      target: {tabId},
      files: ['content.js'],
    });
  }

  if (action === 'contenteditable_to_clipboard') {
    await chrome.scripting.executeScript({
      target: {tabId: tabId},
      function: () => { EditableHtmlToClipboard.contenteditableToClipboard(); },
    });
  } else if (action === 'clipboard_to_contenteditable') {
    await chrome.scripting.executeScript({
      target: {tabId: tabId},
      function: () => { EditableHtmlToClipboard.clipboardToContenteditable(); },
    });
  }
}
