const _ = require('lodash');
let docsData = [];

function addComponent(block) {
  const component = {
    name: block.component,
    description: block.description,
    sections: [],
    props: {}
  };

  return (docsData = [component, ...docsData]);
}

function updateComponent(componentIndex, block) {
  const component = docsData[componentIndex];
  _.set(component, 'name', block.component);
  _.set(component, 'description', block.description);
  return (docsData[componentIndex] = component);
}

function addSection(block) {
  const section = {
    name: block.section,
    variations: {}
  };

  section.variations.core = block.html ? block.html : undefined;
  section.variations.js = block.js ? block.js : undefined;
  section.variations.react = block.react ? block.react : undefined;
  section.variations.angular = block.ts ? block.ts : undefined;
  section.variations.scss = block.scss ? block.scss : undefined;
  section.hidecode = block.hidecode ? block.hidecode : undefined;

  return docsData[0].sections.push(section);
}

function addProp(block) {
  const prop = {
    name: block.prop.name,
    type: block.prop.type,
    description: block.prop.description,
    default: block.prop.default,
    required: block.prop.required
  };

  docsData[0].props[block.prop.library]
    ? docsData[0].props[block.prop.library].push(prop)
    : (docsData[0].props[block.prop.library] = [prop]);

  return docsData;
}

function ensureComponent(block, componentIndex) {
  if (componentIndex < 0) {
    addComponent(block);
  } else if (componentIndex >= 0) {
    updateComponent(componentIndex, block);
  }
}

function ensureSection(block) {
  if (block.section && findSection(block) < 0) {
    addSection(block);
  }
}

function ensureProps(block) {
  if (block.prop && findProps(block) < 0) {
    addProp(block);
  }
}

function findComponent(block) {
  return _.findIndex(docsData, { name: block.component });
}

function findSection(block) {
  return _.findIndex(docsData[0].sections, { name: block.section });
}

function findProps(block) {
  return _.findIndex(docsData[0].props[block.prop.library], {
    name: block.name
  });
}

function createDocsJson(parsedFileComments) {
  _.forEach(parsedFileComments, fileComments => {
    //Every file must have component attribute at the top of it
    if (!fileComments[0].component) return;

    _.forEach(fileComments, comment => {
      const newCommentBlock = {
        component: fileComments[0].component,
        ...comment
      };

      ensureComponent(newCommentBlock, findComponent(newCommentBlock));
      ensureSection(newCommentBlock);
      ensureProps(newCommentBlock);
    });

    return;
  });

  return docsData;
}

module.exports = createDocsJson;
