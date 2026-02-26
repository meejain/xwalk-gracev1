/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCorporateParser from './parsers/hero-corporate.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsCtaParser from './parsers/columns-cta.js';
import cardsIndustryParser from './parsers/cards-industry.js';
import heroVideoParser from './parsers/hero-video.js';
import cardsInsightsParser from './parsers/cards-insights.js';

// TRANSFORMER IMPORTS
import graceCleanupTransformer from './transformers/grace-cleanup.js';
import graceSectionsTransformer from './transformers/grace-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-corporate': heroCorporateParser,
  'cards-product': cardsProductParser,
  'columns-cta': columnsCtaParser,
  'cards-industry': cardsIndustryParser,
  'hero-video': heroVideoParser,
  'cards-insights': cardsInsightsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Corporate homepage for Grace specialty chemicals company featuring product categories, industry solutions, career highlights, and company information',
  urls: [
    'https://grace.com/'
  ],
  blocks: [
    {
      name: 'hero-corporate',
      instances: ['.generic-hero .hero__section']
    },
    {
      name: 'cards-product',
      instances: ['.cmp-card.bio']
    },
    {
      name: 'columns-cta',
      instances: ['.col-xs-12.col-lg-6 > .section > section.white-bkgd']
    },
    {
      name: 'cards-industry',
      instances: ['section.background-image .cmp-card.small']
    },
    {
      name: 'hero-video',
      instances: ['.cmp-media-callout.slate-bkgd']
    },
    {
      name: 'cards-insights',
      instances: ['section#blogs .cmp-media-callout']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.generic-hero',
      style: null,
      blocks: ['hero-corporate'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Company Tagline',
      selector: 'section#aboutgrace',
      style: 'light-gray',
      blocks: [],
      defaultContent: ['section#aboutgrace .cmp-card-list .card-content .text']
    },
    {
      id: 'section-3',
      name: 'Products Heading',
      selector: ['section:not([id]):not(.background-image) > article.m-p-t-md .rich-text', 'section .rich-text h2'],
      style: null,
      blocks: [],
      defaultContent: ['#text-391f94f9d9 h2']
    },
    {
      id: 'section-4',
      name: 'Product Categories',
      selector: 'section article .col-xs-12.col-lg-3',
      style: null,
      blocks: ['cards-product'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'People and Careers',
      selector: 'section article .col-xs-12.col-lg-6',
      style: null,
      blocks: ['columns-cta'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Industries',
      selector: 'section.background-image',
      style: 'background-image',
      blocks: ['cards-industry'],
      defaultContent: ['section.background-image .col-xs-12.col-lg-4 .rich-text h3']
    },
    {
      id: 'section-7',
      name: 'Video Callout',
      selector: '.media-callout .cmp-media-callout.slate-bkgd',
      style: null,
      blocks: ['hero-video'],
      defaultContent: []
    },
    {
      id: 'section-8',
      name: 'Insights from Grace',
      selector: 'section#blogs',
      style: 'light-gray',
      blocks: ['cards-insights'],
      defaultContent: ['section#blogs > article > h2', 'section#allblogs .button__section']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  graceCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [graceSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
