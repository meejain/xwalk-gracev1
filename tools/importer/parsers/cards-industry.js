/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-industry.
 * Base: cards. Source: https://grace.com/
 * Extracts industry tile cards from .cmp-card.small elements in section.background-image.
 * Selectors from captured DOM: section.background-image .cmp-card.small, .image img, .cta
 *
 * Target structure (cards block library - 2 columns per row):
 *   Row N: [image | title-link]
 */
export default function parse(element, { document }) {
  if (!element.isConnected) return;

  // Find all sibling industry cards in the card-group container
  const container = element.closest('.card-group') || element.closest('.cmp-card-list') || element.closest('article');
  const allCards = Array.from(container.querySelectorAll('.cmp-card.small'));

  if (allCards.length === 0) return;

  const cells = [];

  allCards.forEach((card) => {
    const img = card.querySelector('.card-content .image img, .image img, img');
    const ctaText = card.querySelector('.cta.btn-track, .cta');
    const href = card.getAttribute('href');

    // Build content cell: title as link
    const contentCell = [];
    if (ctaText && href) {
      const link = document.createElement('a');
      link.href = href;
      // Clean up cta text (remove icon text)
      link.textContent = ctaText.textContent.replace(/\s+/g, ' ').trim();
      contentCell.push(link);
    } else if (ctaText) {
      contentCell.push(ctaText);
    }

    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-industry', cells });
  element.replaceWith(block);

  // Remove remaining card elements
  allCards.forEach((card) => {
    if (card.isConnected) card.remove();
  });
}
