/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'demo_ecommerce',
  searchClient: algoliasearch('B1G2GM9NG0', 'aadef574be1f9252bb48d4ea09b5cfe5'),
  searchParameters: {
    clickAnalytics: true,
  },
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  })
);

search.addWidget(
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: hit => `
        <div>
          <img src="${hit.image}" align="left" alt="${hit.name}" />
          <div class="hit-name">
            ${hit.name}
          </div>
          <div>
           <button class="button-click"
              data-algolia-objectid="${hit.objectID}"
              data-algolia-position="${hit.hitPosition}"
              data-algolia-queryid="${hit.queryID}"
            >
             Click event
           </button>
           <button class="button-conversion"
              data-algolia-objectid="${hit.objectID}"
              data-algolia-queryid="${hit.queryID}"
           >
             Conversion event
           </button>
          </div>
        </div>
      `,
    },
    transformItems(items) {
      const result = search.helper.lastResults;
      const offset = result.hitsPerPage * result.page;

      return items.map((item, index) => ({
        ...item,
        name: item.name.toUpperCase(),
        queryID: result.queryID,
        hitPosition: offset + index + 1,
      }));
    },
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
  })
);

search.start();

document.getElementById('hits').addEventListener('click', e => {
  if (e.target.matches('.button-click')) {
    window.aa('clickedObjectIDsAfterSearch', {
      index: 'demo_ecommerce',
      eventName: 'click-result',
      objectIDs: [e.target.getAttribute('data-algolia-objectid')],
      queryID: e.target.getAttribute('data-algolia-queryid'),
      // parseInt because getAttribute always returns a string
      positions: [parseInt(e.target.getAttribute('data-algolia-position'), 10)],
    });
  } else if (e.target.matches('.button-conversion')) {
    aa('convertedObjectIDsAfterSearch', {
      index: 'demo_ecommerce',
      eventName: 'conversion',
      queryID: e.target.getAttribute('data-algolia-queryid'),
      objectIDs: [e.target.getAttribute('data-algolia-objectid')],
    });
  }
});
