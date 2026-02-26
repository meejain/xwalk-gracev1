import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-insights-card-image';
      else div.className = 'cards-insights-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // Add "Read more >" link to each card
  ul.querySelectorAll('.cards-insights-card-body').forEach((body) => {
    const titleLink = body.querySelector('a');
    if (titleLink) {
      const readMore = document.createElement('p');
      readMore.className = 'cards-insights-read-more';
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.innerHTML = '<strong>Read more &gt;</strong>';
      readMore.append(link);
      body.append(readMore);
    }
  });

  block.replaceChildren(ul);
}
