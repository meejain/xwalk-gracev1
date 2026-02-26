/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta.
 * Base: columns. Source: https://grace.com/
 * Extracts two-column layout with image, text, and CTA from side-by-side sections.
 * Selectors from captured DOM: .col-xs-12.col-lg-6 > .section > section.white-bkgd
 *
 * Target structure (columns block library - 2 columns per row):
 *   Row 1: [image + text + CTA | image + text + CTA]
 */
export default function parse(element, { document }) {
  if (!element.isConnected) return;

  // element is section.white-bkgd inside a .col-lg-6
  // Find the parent row that contains both columns
  const colContainer = element.closest('.col-xs-12.col-lg-6');
  if (!colContainer) return;

  const row = colContainer.closest('.row') || colContainer.parentElement;
  const allCols = Array.from(row.querySelectorAll(':scope > .col-xs-12.col-lg-6'));

  const columnCells = [];

  allCols.forEach((col) => {
    const img = col.querySelector('.cmp-image__image, .cmp-image img, img');
    const text = col.querySelector('.rich-text p, .rich-text, .text p');
    const ctaLink = col.querySelector('.button__section a.btn-primary, a.btn-primary');

    const cellContent = [];
    if (img) cellContent.push(img);
    if (text) {
      const p = document.createElement('p');
      p.textContent = text.textContent.trim();
      cellContent.push(p);
    }
    if (ctaLink) {
      // Clean up CTA text (remove nbsp)
      const span = ctaLink.querySelector('.cmp-button__text');
      if (span) {
        span.textContent = span.textContent.replace(/\u00a0/g, '').trim();
      }
      cellContent.push(ctaLink);
    }

    columnCells.push(cellContent);
  });

  // Build a single row with all columns
  const cells = [];
  if (columnCells.length > 0) {
    cells.push(columnCells);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);

  // Remove other column containers
  allCols.forEach((col) => {
    if (col.isConnected) col.remove();
  });
}
