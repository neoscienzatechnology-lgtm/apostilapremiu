/**
 * Biblioteca de Sanitização - Previne XSS
 * Uso: import { sanitizeHTML, sanitizeText } from './sanitize.js';
 */

export function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function sanitizeHTML(html) {
  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'];
  const allowedAttributes = {
    'a': ['href', 'title', 'target'],
    'code': ['class']
  };

  const temp = document.createElement('div');
  temp.innerHTML = html;

  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      if (!allowedTags.includes(tagName)) {
        const textNode = document.createTextNode(node.textContent);
        node.parentNode?.replaceChild(textNode, node);
        return textNode;
      }

      const allowedAttrs = allowedAttributes[tagName] || [];
      Array.from(node.attributes).forEach(attr => {
        if (!allowedAttrs.includes(attr.name)) {
          node.removeAttribute(attr.name);
        }
      });

      if (tagName === 'a') {
        const href = node.getAttribute('href');
        if (href && !href.match(/^(https?:\/\/|\/|#)/)) {
          node.removeAttribute('href');
        }
      }

      Array.from(node.childNodes).forEach(child => cleanNode(child));
    }

    return node;
  }

  Array.from(temp.childNodes).forEach(child => cleanNode(child));
  return temp.innerHTML;
}

export function createSafeElement(tag, options = {}) {
  const element = document.createElement(tag);
  
  if (options.text) {
    element.textContent = options.text;
  }
  
  if (options.className) {
    element.className = options.className;
  }
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      if (key === 'href' && !value.match(/^(https?:\/\/|\/|#)/)) {
        return;
      }
      element.setAttribute(key, value);
    });
  }
  
  return element;
}
