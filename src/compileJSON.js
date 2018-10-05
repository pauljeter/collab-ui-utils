const _ = require('lodash');

const compareSections = (navSections, docSections) => {
  return navSections.reduce(
    (agg, ele, idx) => {
      const newAgg = [...agg];

      const aggItem = docSections.filter(componentSection => {
        if (ele.section === componentSection.name) {
          const newObject = {
            ...ele,
            ...componentSection,
            name: componentSection.name || ele.name,
            description: componentSection.description || ele.description,
            variations: {
              ...componentSection.variations,
              ...(ele.variations ? ele.variations : [])
            }
          };

          return newAgg.splice(idx, 1, newObject);
        }

        return null;
      });

      return aggItem[0] ? newAgg : agg;
    },
    [...navSections]
  );
};

export function compile(navJSON, libraryJSON) {
  // Loop through Nav JSON Object looking at each Key
  const newObject = navJSON.reduce((agg, component, index) => {
    const componentIndex = _.findIndex(libraryJSON, {
      name: component.component
    });

    if (componentIndex >= 0 && component.sections) {
      const combinedSections = compareSections(
        component.sections,
        libraryJSON[componentIndex].sections
      );

      agg[index].sections = combinedSections;
      // TODO Create Merge Method once core has props
      agg[index].props = agg[index].props
        ? (agg[index].props = {
            ...agg[index].props,
            ...libraryJSON[componentIndex].props
          })
        : (agg[index].props = libraryJSON[componentIndex].props);

      return agg;
    }

    return agg;
  }, navJSON);

  return [...newObject];
}

export function filterJSON(compiledJSON) {
  // Categories that can remain without component examples
  const staticCategories = ['overview', 'develop', 'styles'];
  // Loop through Nav JSON Object looking at each Key
  const newObject = Object.keys(compiledJSON).reduce((agg, category) => {
    if (staticCategories.includes(category)) {
      return Object.assign({}, agg, {
        ...agg,
        [category]: compiledJSON[category]
      });
    }
    // Find Children that contain sections
    const validChildren = compiledJSON[category].children.reduce(
      (agg, child) => {
        if (!child.sections) return agg;
        // Find sections that contain examples
        const validSections = child.sections.filter(section => {
          if (section.core) {
            return section;
          } else if (section.examples && section.examples.js) {
            return section;
          }

          return false;
        });
        // Inlcude only children that have valid sections
        if (validSections.length > 0) {
          return agg.concat({
            ...child,
            sections: validSections
          });
        }

        return agg;
      },
      []
    );

    // Include only categories that have valid children
    if (validChildren.length > 0) {
      return {
        ...agg,
        [category]: {
          ...compiledJSON[category],
          children: validChildren
        }
      };
    }

    return agg;
  }, {});

  return { ...newObject };
}
