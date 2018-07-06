const _ = require('lodash');
const docsData = {};

function addCategory(block) {
  const newCat = {
    name: block.category,
    components: {}
  }
  return docsData[block.category] = newCat;
}

function addComponent(block) {
  const component = {
    name: block.name,
    component: block.component,
    description: block.description,
    sections: []
  }
  const category = findCategory(block);
  return category.components[block.component] = component;
}

function updateComponent(block) {
  const category = findCategory(block);
  const component = category.components[block.component];
  _.set(component, 'name', block.name);
  _.set(component, 'description', block.description);
  return category.components[block.component];
}

function addSection(block) {
  const section = {
    name: block.name,
    description: block.description,
    category: block.category,
    component: block.component,
    section: block.section,
    variations: {},
    examples: {},
  };
  section.variables = block.variable ? block.variable : undefined;
  section.variations.html = block.html ? block.html : undefined;
  section.variations.react = block.js ? block.js : undefined;
  section.variations.angular = block.ts ? block.ts : undefined;
  section.variations.scss = block.scss ? block.scss : undefined;
  section.params = block.param ? block.param : undefined;
  section.states = block.state ? block.state : undefined;
  section.props = block.props ? block.props : undefined;
  section.hidecode = block.hidecode ? block.hidecode : undefined;

  const component = findComponent(block);
  return component.sections.push(section);
}

function addVariation(block) {
  const variation = {
    variation: block.variation,
  }
  variation.variables = block.variable ? block.variable : undefined;
  variation.html = block.html ? block.html : undefined;
  variation.js = block.js ? block.js : undefined;
  variation.scss = block.scss ? block.scss : undefined;
  variation.params = block.param ? block.param : undefined;
  variation.states = block.state ? block.state : undefined;

  const section = findSection(block);
  return section.variations[block.variation] = variation;
}

function findCategory(block) {
  return docsData[block.category];
}

function findComponent(block) {
  return _.get(docsData[block.category].components, block.component, false);
}

function findSection(block) {
  return _.get(docsData[block.category].components[block.component].sections, block.section);
}

function findVariation(block) {
  return _.get(docsData[block.category].components[block.component].sections[block.section].variations, block.variation);
}

function createDocsJson(blocks) {

  _.forEach(blocks, (block) => {
    if (!block.category || !block.component) {
      return;
    }

    if (!_.find(docsData[block.category])) {
      addCategory(block);
    }

    if (!findComponent(block)) {
      addComponent(block);
    } else if (!block.section) {
      updateComponent(block);
    }

    if (block.section && !findSection(block)) {
      addSection(block);
    }

    if (block.variation && !findVariation(block)) {
      addVariation(block);
    }
  });


  return docsData;
}

module.exports = createDocsJson;
