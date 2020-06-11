const { dirname, resolve } = require('path');
const pkg = require('../../../package.json');

module.exports = ({ types: t }) => {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          const dir = dirname(state.filename);
          const imports = findImports(path);
          if (!imports.length) return;
          const criticalComponents = getLocalNames(imports);
          const jsxElements = findCriticalJSXElements(path, criticalComponents);
          const sources = getSources(jsxElements).map(source => resolve(dir, source));
          const newImports = sources
            .map(source => `next-critical/loader!${source}`)
            .map(source => t.importDeclaration([], t.stringLiteral(source)));
          newImports.forEach(declaration => path.unshiftContainer('body', declaration));
          imports.forEach(path => path.remove());
          jsxElements.forEach(path => path.remove());
        },
      },
    },
  };
};

function findImports(path) {
  const paths = [];
  const enter = path => {
    if (!path.node || !path.node.source) return;
    if (path.node.source.value === `${pkg.name}/critical`) paths.push(path);
  };
  path.traverse({ ImportDeclaration: { enter } });
  return paths;
}

function findCriticalJSXElements(path, componentNames) {
  const paths = [];
  const componentNamesMatcher = new RegExp(`(${componentNames.join('|')})`);
  const enter = path => {
    if (componentNamesMatcher.test(path.node.openingElement.name.name)) paths.push(path);
  };
  path.traverse({ JSXElement: { enter } });
  return paths;
}

function getLocalNames(imports) {
  return imports.map(path => path.node.specifiers[0].local.name);
}

function getSources(jsxElements) {
  return jsxElements
    .map(path => path.node.openingElement.attributes.find(attr => attr.name.name === 'src'))
    .filter(attr => !!attr && !!attr.value)
    .map(attr => attr.value.value)
    .filter(source => typeof source !== 'undefined');
}
