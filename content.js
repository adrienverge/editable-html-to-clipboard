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

chrome.runtime.onMessage.addListener(async message => {
  const editable = getContenteditableElement();
  if (!editable) {
    displayToast('No editable field is currently focused.');
    return;
  }

  if (message.id === 'contenteditable_to_clipboard') {
    navigator.clipboard.writeText(editable.innerHTML);

    displayToast('📋 HTML source copied to the clipboard.\n' +
                 'Edit it, then Ctrl+Shift+. to paste it back.', 'from-left');

  } else if (message.id === 'clipboard_to_contenteditable') {
    const clipboardContents = await navigator.clipboard.readText();
    if (!clipboardContents || !clipboardContents.trim()) {
      displayToast('The clipboard is empty.');
      return;
    }

    // Use 'document.execCommand()' although it's deprecated, instead of 
    // 'editable.innerHTML = …'. This allows saving a state in history, so
    // it's possible to undo this action with Ctrl+Z.
    document.execCommand('selectAll', false, null);
    document.execCommand('formatBlock', false, 'div')
    document.execCommand('insertHTML', false, clipboardContents);

    displayToast('📝 HTML source replaced from the clipboard.\n' +
                 'Use Ctrl+Z twice to undo.', 'from-right');
  }
});

function getContenteditableElement() {
  const element = document.activeElement.closest(
    '[contenteditable], [contentEditable]');

  if (!element) {
    return null;
  }

  if (element.contentEditable !== true && element.contentEditable !== 'true' &&
      element.contenteditable !== true && element.contenteditable !== 'true') {
    return null;
  }

  return element;
}

function displayToast(message, style) {
  const toast = document.createElement('div');
  toast.classList.add('editable-html-to-clipboard-toast');
  if (style === 'from-left' || style === 'from-right') {
    toast.classList.add(style);
  }
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
