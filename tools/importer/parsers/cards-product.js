/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product.
 * Base: cards. Source: https://grace.com/
 * Extracts product category cards from .cmp-card.bio elements.
 * Selectors from captured DOM: .cmp-card.bio, .card-content .image img, .h4.title, .spt-copy p
 *
 * Target structure (cards block library - 2 columns per row):
 *   Row N: [image | title + description]
 */
export default function parse(element, { document }) {
  // Skip if element was already processed (removed from DOM by a previous call)
  if (!element.isConnected) return;

  // Find all sibling product cards in the nearest shared container
  const container = element.closest('article') || element.closest('section') || element.parentElement;
  const allCards = Array.from(container.querySelectorAll('.cmp-card.bio'));

  if (allCards.length === 0) return;

  const cells = [];

  allCards.forEach((card) => {
    const img = card.querySelector('.card-content .image img, .image img');
    const title = card.querySelector('.h4.title, p.title');
    const desc = card.querySelector('.spt-copy p');
    const href = card.getAttribute('href');

    // Build content cell: linked title + description
    const contentCell = [];
    if (title) {
      if (href) {
        const titleLink = document.createElement('a');
        titleLink.href = href;
        titleLink.textContent = title.textContent.trim();
        const strong = document.createElement('strong');
        strong.append(titleLink);
        contentCell.push(strong);
      } else {
        contentCell.push(title);
      }
    }
    if (desc) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      contentCell.push(descP);
    }

    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);

  // Remove remaining card elements so they are not processed again
  allCards.forEach((card) => {
    if (card.isConnected) {
      card.remove();
    }
  });
}
