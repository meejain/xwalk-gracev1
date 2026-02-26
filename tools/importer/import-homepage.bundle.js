const CustomImportScript = (() => {
  const __defProp = Object.defineProperty;
  const __defProps = Object.defineProperties;
  const __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  const __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  const __getOwnPropNames = Object.getOwnPropertyNames;
  const __getOwnPropSymbols = Object.getOwnPropertySymbols;
  const __hasOwnProp = Object.prototype.hasOwnProperty;
  const __propIsEnum = Object.prototype.propertyIsEnumerable;
  const __defNormalProp = (obj, key, value) => (key in obj ? __defProp(obj, key, {
    enumerable: true, configurable: true, writable: true, value,
  }) : obj[key] = value);
  const __spreadValues = (a, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) {
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
      }
    }
    return a;
  };
  const __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  const __export = (target, all) => {
    for (const name in all) __defProp(target, name, { get: all[name], enumerable: true });
  };
  const __copyProps = (to, from, except, desc) => {
    if (from && typeof from === 'object' || typeof from === 'function') {
      for (const key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  const __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

  // tools/importer/import-homepage.js
  const import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default,
  });

  // tools/importer/parsers/hero-corporate.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(':scope > img') || element.querySelector('img:first-of-type');
    const heading = element.querySelector('.hero__heading h1, .hero__content h1, h1');
    const ctaLink = element.querySelector('.hero__button a.btn-primary, .button__section a.btn-primary, a.btn-primary');
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentElements = [];
    if (heading) contentElements.push(heading);
    if (ctaLink) {
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

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document }) {
    if (!element.isConnected) return;
    const container = element.closest('article') || element.closest('section') || element.parentElement;
    const allCards = Array.from(container.querySelectorAll('.cmp-card.bio'));
    if (allCards.length === 0) return;
    const cells = [];
    allCards.forEach((card) => {
      const img = card.querySelector('.card-content .image img, .image img');
      const title = card.querySelector('.h4.title, p.title');
      const desc = card.querySelector('.spt-copy p');
      const href = card.getAttribute('href');
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
    allCards.forEach((card) => {
      if (card.isConnected) {
        card.remove();
      }
    });
  }

  // tools/importer/parsers/columns-cta.js
  function parse3(element, { document }) {
    if (!element.isConnected) return;
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
        const span = ctaLink.querySelector('.cmp-button__text');
        if (span) {
          span.textContent = span.textContent.replace(/\u00a0/g, '').trim();
        }
        cellContent.push(ctaLink);
      }
      columnCells.push(cellContent);
    });
    const cells = [];
    if (columnCells.length > 0) {
      cells.push(columnCells);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
    element.replaceWith(block);
    allCols.forEach((col) => {
      if (col.isConnected) col.remove();
    });
  }

  // tools/importer/parsers/cards-industry.js
  function parse4(element, { document }) {
    if (!element.isConnected) return;
    const container = element.closest('.card-group') || element.closest('.cmp-card-list') || element.closest('article');
    const allCards = Array.from(container.querySelectorAll('.cmp-card.small'));
    if (allCards.length === 0) return;
    const cells = [];
    allCards.forEach((card) => {
      const img = card.querySelector('.card-content .image img, .image img, img');
      const ctaText = card.querySelector('.cta.btn-track, .cta');
      const href = card.getAttribute('href');
      const contentCell = [];
      if (ctaText && href) {
        const link = document.createElement('a');
        link.href = href;
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
    allCards.forEach((card) => {
      if (card.isConnected) card.remove();
    });
  }

  // tools/importer/parsers/hero-video.js
  function parse5(element, { document }) {
    const img = element.querySelector('.media-video .img img, .media-image .img img, .img img');
    const heading = element.querySelector('.text-position .h2, .subhead-large.header-on-mobile');
    const subtext = element.querySelector('.text-position .body p, .video-hover .subhead-large p');
    const iframe = element.querySelector('iframe[src*="youtube"]');
    let videoUrl = '';
    if (iframe) {
      videoUrl = iframe.getAttribute('src') || '';
      if (videoUrl.startsWith('//')) videoUrl = `https:${videoUrl}`;
      const urlParts = videoUrl.split('?');
      videoUrl = urlParts[0];
    }
    const cells = [];
    if (img) {
      cells.push([img]);
    }
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

  // tools/importer/parsers/cards-insights.js
  function parse6(element, { document }) {
    if (!element.isConnected) return;
    const blogsSection = element.closest('section#blogs') || element.closest('article');
    const allCallouts = Array.from(blogsSection.querySelectorAll('.cmp-media-callout:not(.slate-bkgd)'));
    if (allCallouts.length === 0) return;
    const cells = [];
    allCallouts.forEach((callout) => {
      const img = callout.querySelector('.media-image .img img, .img img, img');
      const category = callout.querySelector('.subhead-small h5, h5');
      const titleLink = callout.querySelector('.subhead-small p a, .subhead-small p:first-of-type a');
      const contentCell = [];
      if (category) {
        const catP = document.createElement('p');
        catP.innerHTML = `<em>${category.textContent.trim()}</em>`;
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
    allCallouts.forEach((callout) => {
      if (callout.isConnected) callout.remove();
    });
  }

  // tools/importer/transformers/grace-cleanup.js
  const H = { before: 'beforeTransform', after: 'afterTransform' };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
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
      WebImporter.DOMUtils.remove(element, [
        '.cmp-experiencefragment--header',
        '.cmp-experiencefragment--footer',
        'a.skip-content',
        'iframe',
        'noscript',
        'video.hidden',
      ]);
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

  // tools/importer/transformers/grace-sections.js
  const H2 = { before: 'beforeTransform', after: 'afterTransform' };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { sections } = template;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: 'Section Metadata',
            cells: { style: section.style },
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement('hr');
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  const parsers = {
    'hero-corporate': parse,
    'cards-product': parse2,
    'columns-cta': parse3,
    'cards-industry': parse4,
    'hero-video': parse5,
    'cards-insights': parse6,
  };
  const PAGE_TEMPLATE = {
    name: 'homepage',
    description: 'Corporate homepage for Grace specialty chemicals company featuring product categories, industry solutions, career highlights, and company information',
    urls: [
      'https://grace.com/',
    ],
    blocks: [
      {
        name: 'hero-corporate',
        instances: ['.generic-hero .hero__section'],
      },
      {
        name: 'cards-product',
        instances: ['.cmp-card.bio'],
      },
      {
        name: 'columns-cta',
        instances: ['.col-xs-12.col-lg-6 > .section > section.white-bkgd'],
      },
      {
        name: 'cards-industry',
        instances: ['section.background-image .cmp-card.small'],
      },
      {
        name: 'hero-video',
        instances: ['.cmp-media-callout.slate-bkgd'],
      },
      {
        name: 'cards-insights',
        instances: ['section#blogs .cmp-media-callout'],
      },
    ],
    sections: [
      {
        id: 'section-1',
        name: 'Hero',
        selector: '.generic-hero',
        style: null,
        blocks: ['hero-corporate'],
        defaultContent: [],
      },
      {
        id: 'section-2',
        name: 'Company Tagline',
        selector: 'section#aboutgrace',
        style: 'light-gray',
        blocks: [],
        defaultContent: ['section#aboutgrace .cmp-card-list .card-content .text'],
      },
      {
        id: 'section-3',
        name: 'Products Heading',
        selector: ['section:not([id]):not(.background-image) > article.m-p-t-md .rich-text', 'section .rich-text h2'],
        style: null,
        blocks: [],
        defaultContent: ['#text-391f94f9d9 h2'],
      },
      {
        id: 'section-4',
        name: 'Product Categories',
        selector: 'section article .col-xs-12.col-lg-3',
        style: null,
        blocks: ['cards-product'],
        defaultContent: [],
      },
      {
        id: 'section-5',
        name: 'People and Careers',
        selector: 'section article .col-xs-12.col-lg-6',
        style: null,
        blocks: ['columns-cta'],
        defaultContent: [],
      },
      {
        id: 'section-6',
        name: 'Industries',
        selector: 'section.background-image',
        style: 'background-image',
        blocks: ['cards-industry'],
        defaultContent: ['section.background-image .col-xs-12.col-lg-4 .rich-text h3'],
      },
      {
        id: 'section-7',
        name: 'Video Callout',
        selector: '.media-callout .cmp-media-callout.slate-bkgd',
        style: null,
        blocks: ['hero-video'],
        defaultContent: [],
      },
      {
        id: 'section-8',
        name: 'Insights from Grace',
        selector: 'section#blogs',
        style: 'light-gray',
        blocks: ['cards-insights'],
        defaultContent: ['section#blogs > article > h2', 'section#allblogs .button__section'],
      },
    ],
  };
  const transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE,
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document, url, html, params,
      } = payload;
      const main = document.body;
      executeTransformers('beforeTransform', main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers('afterTransform', main, payload);
      const hr = document.createElement('hr');
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
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
  return __toCommonJS(import_homepage_exports);
})();
