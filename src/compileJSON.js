const compareSections = (navSections, docSections, isCollabUI) =>
  navSections.reduce(
    (agg, ele, idx) => {
      const newAgg = [...agg];

      const aggItem = docSections.filter(componentSection => {
        if (ele.section === componentSection.section) {
          const newObject = {
            ...ele,
            ...componentSection,
            name: componentSection.name || ele.name,
            description: componentSection.description || ele.description,
            core: isCollabUI || false,
            examples: componentSection.examples,
          };

          return newAgg.splice(idx, 1, newObject);
        }

        return null;
      });

      return aggItem[0] ? newAgg : agg;
    },
    [...navSections]
  );

export function compile(navJSON, libraryJSON, isCollabUI) {
  // Loop through Nav JSON Object looking at each Key
  const newObject = Object.keys(navJSON).reduce((agg, navCategory) => {
    // Variables for readabilitys
    const newAgg = Object.assign({}, agg);

    const hasChildren = !!navJSON[navCategory].children;

    // Loop through Children Components to see if Collab-UI has matching section
    if (hasChildren) {
      return navJSON[navCategory].children.map((navComponent, idx) => {
        const loopComponent = navComponent.component;

        if (
          libraryJSON[navCategory] &&
          libraryJSON[navCategory].components &&
          libraryJSON[navCategory].components[loopComponent] &&
          libraryJSON[navCategory].components[loopComponent].sections &&
          navJSON[navCategory] &&
          navJSON[navCategory].children &&
          navJSON[navCategory].children[idx].sections
        ) {
          const combinedSections = compareSections(
            navJSON[navCategory].children[idx].sections,
            libraryJSON[navCategory].components[loopComponent].sections,
            isCollabUI
          );
          newAgg[navCategory].children[idx].sections = combinedSections;

          return newAgg;
        }

        newAgg[navCategory] = navJSON[navCategory];
        return newAgg;
      })[0];
    }
  }, navJSON);

  return { ...newObject };
}

export function filterJSON(compiledJSON) {
  // Categories that can remain without component examples
  const staticCategories = ['overview', 'develop', 'styles'];
  // Loop through Nav JSON Object looking at each Key
  const newObject = Object.keys(compiledJSON).reduce((agg, category) => {

    if (staticCategories.includes(category)) {
      return Object.assign({}, agg, { ...agg, [category]: compiledJSON[category] });
    }
    // Find Children that contain sections
    const validChildren = compiledJSON[category].children.reduce((agg, child) => {
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
    }, []);
    
    // Include only categories that have valid children
    if (validChildren.length > 0) {
      return ({
        ...agg,
        [category]: {
          ...compiledJSON[category],
          children: validChildren
        }
      });
    }

    return agg;
  }, {});

  return { ...newObject };
}