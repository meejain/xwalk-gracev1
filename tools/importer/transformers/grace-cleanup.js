/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Grace.com cleanup.
 * Removes non-authorable content from grace.com pages.
 * All selectors verified from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/tracking widgets (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.grecaptcha-badge',
      'iframe[title="Adobe ID Syncing iFrame"]',
      '.contact-us-sticky',
      '.alert-banner',
      '.search-bar-cmp',
      '.patent-number',
      '.media-modal',
      '.background-gradient',
      'link[href*="clientlibs"]',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable content (header, footer, nav, skip link)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      'a.skip-content',
      'iframe',
      'noscript',
      'video.hidden',
    ]);

    // Clean up tracking/unnecessary attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer-enabled');
      el.removeAttribute('data-published-date');
      el.removeAttribute('data-industry');
      el.removeAttribute('data-operating-segment');
      el.removeAttribute('data-site-sections');
      el.removeAttribute('data-template');
    });
  }
}
