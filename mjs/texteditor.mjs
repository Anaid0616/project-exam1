// mjs/texteditor.mjs

export function setupSimpleTextEditor({
  textareaSelector = '#body-input',
  toolbarSelector = '.editor-toolbar',
} = {}) {
  const textarea = document.querySelector(textareaSelector);
  const toolbar = document.querySelector(toolbarSelector);

  if (!textarea || !toolbar) return;

  toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-format]');
    if (!button) return;

    const format = button.dataset.format;
    handleFormat(format, textarea);
    textarea.focus();
  });
}

function handleFormat(format, textarea) {
  switch (format) {
    case 'bold':
      wrapSelection(textarea, '<strong>', '</strong>');
      break;
    case 'italic':
      wrapSelection(textarea, '<em>', '</em>');
      break;
    case 'underline':
      wrapSelection(textarea, '<u>', '</u>');
      break;
    case 'h2':
      wrapSelection(textarea, '<h2>', '</h2>');
      break;
    case 'bullet':
      insertBulletList(textarea);
      break;
    default:
      break;
  }
}

function wrapSelection(textarea, before, after) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  let selected = value.slice(start, end);

  // If already wrapped, unwrap
  if (selected.startsWith(before) && selected.endsWith(after)) {
    const inner = selected.slice(before.length, selected.length - after.length);
    textarea.value = value.slice(0, start) + inner + value.slice(end);

    const cursorPos = start + inner.length;
    textarea.selectionStart = textarea.selectionEnd = cursorPos;
    return;
  }

  // Otherwise, wrap selection or insert tags
  if (!selected) selected = 'text';

  const newText = before + selected + after;

  textarea.value = value.slice(0, start) + newText + value.slice(end);

  const cursorPos = start + before.length + selected.length;
  textarea.selectionStart = textarea.selectionEnd = cursorPos;
}
function insertBulletList(textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);

  // 1. If selection is already a <ul>, remove it and convert to plain text
  if (/^\s*<ul[\s>]/.test(selected) && /<\/ul>\s*$/.test(selected)) {
    const liMatches = [...selected.matchAll(/<li>(.*?)<\/li>/gs)];
    const plainLines = liMatches.map((m) => m[1]);
    const plainText = plainLines.join('\n');

    textarea.value = value.slice(0, start) + plainText + value.slice(end);
    const cursorPos = start + plainText.length;
    textarea.selectionStart = textarea.selectionEnd = cursorPos;
    return;
  }

  // 2. If selection consists of multiple lines, convert each line to <li>
  let baseText = selected || 'List item';
  let lines = baseText.split('\n').map((line) => line.trim());

  const allAreLi =
    lines.length > 0 &&
    lines.every((line) => line.startsWith('<li>') && line.endsWith('</li>'));

  if (allAreLi) {
    lines = lines.map((line) =>
      line.replace(/^<li>/, '').replace(/<\/li>$/, '')
    );
  }

  // 3. Trim down empty lines
  const cleanLines = lines.filter((line) => line.length > 0);

  const safeLines = cleanLines.length > 0 ? cleanLines : ['List item'];

  const listHtml =
    '<ul>\n' + safeLines.map((l) => `  <li>${l}</li>`).join('\n') + '\n</ul>';

  textarea.value = value.slice(0, start) + listHtml + value.slice(end);

  const cursorPos = start + listHtml.length;
  textarea.selectionStart = textarea.selectionEnd = cursorPos;
}
