/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-corporate.
 * Base: hero. Source: https://grace.com/
 * Extracts background image, heading, and CTA from .hero__section.
 * Selectors from captured DOM: img (direct child), .hero__heading h1, .hero__button a.btn-primary
 *
 * Target structure (hero block library - 1 column):
 *   Row 1: [background image]
 *   Row 2: [heading + CTA in single cell]
 */
export default function parse(element, { document }) {
  // Background image - first img child (may be background image or scene7 image)
  const bgImage = element.querySelector(':scope > img') || element.querySelector('img:first-of-type');

  // Heading - h1 inside .hero__heading or .hero__content
  const heading = element.querySelector('.hero__heading h1, .hero__content h1, h1');

  // CTA link - primary button
  const ctaLink = element.querySelector('.hero__button a.btn-primary, .button__section a.btn-primary, a.btn-primary');

  const cells = [];

  // Row 1: background image (single cell)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: heading + CTA combined in single cell (hero is 1-column block)
  const contentElements = [];
  if (heading) contentElements.push(heading);
  if (ctaLink) {
    // Clean up the CTA text (remove nbsp)
    const span = ctaLink.querySelector('.cmp-button__text');
    if (span) {
      span.textContent = span.textContent.replace(/\u00a0/g, '').trim();
    }
    contentElements.push(ctaLink);
  }
  if (contentElements.length > 0) {
    cells.push([contentElements]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-corporate', cells });
  element.replaceWith(block);
}
