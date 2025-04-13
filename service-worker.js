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
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  await chrome.tabs.sendMessage(tab.id, {id: info.menuItemId});
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  await chrome.tabs.sendMessage(tab.id, {id: command});
});
