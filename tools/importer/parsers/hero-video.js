/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video.
 * Base: hero. Source: https://grace.com/
 * Extracts video callout with heading, subtext, and video link from .cmp-media-callout.slate-bkgd.
 * Selectors from captured DOM: .media-video .img img, .text-position .h2, .text-position .body p, iframe[src*=youtube]
 *
 * Target structure (hero block library - 1 column):
 *   Row 1: [background/video still image]
 *   Row 2: [heading + subtext + video link in single cell]
 */
export default function parse(element, { document }) {
  // Video still image
  const img = element.querySelector('.media-video .img img, .media-image .img img, .img img');

  // Heading - from .text-position overlay or .subhead-large
  const heading = element.querySelector('.text-position .h2, .subhead-large.header-on-mobile');

  // Subtext - from .text-position .body or .video-hover .subhead-large
  const subtext = element.querySelector('.text-position .body p, .video-hover .subhead-large p');

  // Video URL - from iframe src or from the CTA link
  const iframe = element.querySelector('iframe[src*="youtube"]');
  let videoUrl = '';
  if (iframe) {
    videoUrl = iframe.getAttribute('src') || '';
    // Clean up the URL - remove protocol-relative and query params
    if (videoUrl.startsWith('//')) videoUrl = 'https:' + videoUrl;
    // Extract base embed URL
    const urlParts = videoUrl.split('?');
    videoUrl = urlParts[0];
  }

  const cells = [];

  // Row 1: video still image
  if (img) {
    cells.push([img]);
  }

  // Row 2: heading + subtext + video link (single cell)
  const contentElements = [];
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentElements.push(h2);
  }
  if (subtext) {
    const p = document.createElement('p');
    p.textContent = subtext.textContent.trim();
    contentElements.push(p);
  }
  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = 'Watch the video';
    contentElements.push(videoLink);
  }

  if (contentElements.length > 0) {
    cells.push([contentElements]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
