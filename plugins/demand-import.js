module.exports = ({ types: t }) => ({
  visitor: {
    ImportDeclaration(path, { opts }) {
      // 我们可以通过 specifiers 拿到导入的东西，source 来拿到从哪个库导入的
      const { specifiers, source } = path.node;
      if (!opts.libName) throw new Error('必须要配置 libName');
      if (opts.libName !== source.value) return;
      // 排除 default 的导入情况
      if (!t.isImportDefaultSpecifier(specifiers[0])) {
        const declarations = specifiers.map(specifier => {
          // 我们可以通过 specifier.imported.name 获取到导入的东西
          // 先写死 antd
          const importPath = `${opts.libName}/${opts.libDir || 'lib'}/${
            specifier.imported.name
          }`;
          // 我们通过上面的信息返回了一条 import 语句
          return t.ImportDeclaration(
            [t.ImportDefaultSpecifier(specifier.local)],
            t.StringLiteral(importPath)
          );
        });
        // 将上面生成的 import 语句替换到原来的语句
        path.replaceWithMultiple(declarations);
      }
    }
  }
});
