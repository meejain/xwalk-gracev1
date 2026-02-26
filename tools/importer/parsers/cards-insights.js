/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-insights.
 * Base: cards. Source: https://grace.com/
 * Extracts blog/insight cards from .cmp-media-callout elements in section#blogs.
 * Selectors from captured DOM: section#blogs .cmp-media-callout, .media-image .img img, .subhead-small h5, .subhead-small p a
 *
 * Target structure (cards block library - 2 columns per row):
 *   Row N: [image | category + title-link]
 */
export default function parse(element, { document }) {
  if (!element.isConnected) return;

  // Find the blogs section container with all insight cards
  const blogsSection = element.closest('section#blogs') || element.closest('article');
  const allCallouts = Array.from(blogsSection.querySelectorAll('.cmp-media-callout:not(.slate-bkgd)'));

  if (allCallouts.length === 0) return;

  const cells = [];

  allCallouts.forEach((callout) => {
    const img = callout.querySelector('.media-image .img img, .img img, img');
    const category = callout.querySelector('.subhead-small h5, h5');
    const titleLink = callout.querySelector('.subhead-small p a, .subhead-small p:first-of-type a');

    // Build content cell: category tag + title link
    const contentCell = [];
    if (category) {
      const catP = document.createElement('p');
      catP.innerHTML = '<em>' + category.textContent.trim() + '</em>';
      contentCell.push(catP);
    }
    if (titleLink) {
      const titleP = document.createElement('p');
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href') || '';
      link.textContent = titleLink.textContent.trim();
      const strong = document.createElement('strong');
      strong.append(link);
      titleP.append(strong);
      contentCell.push(titleP);
    }

    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-insights', cells });
  element.replaceWith(block);

  // Remove remaining callout elements
  allCallouts.forEach((callout) => {
    if (callout.isConnected) callout.remove();
  });
}
