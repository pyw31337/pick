const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'inject-main.js'), 'utf8');

function boot() {
  const listeners = new Map();
  const root = {
    attrs: {},
    addEventListener(type, fn) { listeners.set(type, fn); },
    dispatchEvent(event) { listeners.get(event.type)?.(event); return true; },
    setAttribute(name, value) { this.attrs[name] = value; },
    getAttribute(name) { return this.attrs[name] || ''; }
  };
  const originalFetch = () => Promise.resolve({
    url: 'https://example.test/video.mp4',
    headers: { get: () => 'video/mp4' },
    clone: () => ({ text: () => Promise.resolve('') })
  });
  function XHR() {}
  XHR.prototype.open = function open() {};
  function Media() {}
  Media.prototype.setMediaKeys = function setMediaKeys() { return Promise.resolve(); };
  const window = {
    fetch: originalFetch,
    addEventListener() {},
    location: { href: 'https://example.test/' }
  };
  window.window = window;
  let intervalCount = 0;
  const context = {
    window,
    document: { documentElement: root, readyState: 'complete', scripts: [], addEventListener() {} },
    navigator: {},
    performance: { getEntriesByType: () => [], setResourceTimingBufferSize() {} },
    HTMLMediaElement: Media,
    XMLHttpRequest: XHR,
    location: window.location,
    CustomEvent: function CustomEvent(type, init) { this.type = type; this.detail = init?.detail; },
    setTimeout,
    setInterval: () => { intervalCount += 1; return intervalCount; },
    clearInterval() {}
  };
  vm.runInNewContext(source, context, { filename: 'inject-main.js' });
  return { root, window, originalFetch, getIntervalCount: () => intervalCount };
}

test('does not patch page APIs before an inspection request', () => {
  const { window, originalFetch, getIntervalCount } = boot();
  assert.equal(window.fetch, originalFetch);
  assert.equal(getIntervalCount(), 0);
});

test('installs hooks only after sl-extract-now', () => {
  const { root, window, originalFetch, getIntervalCount } = boot();
  root.dispatchEvent(new CustomEvent('sl-extract-now'));
  assert.notEqual(window.fetch, originalFetch);
  assert.equal(getIntervalCount(), 1);
});
