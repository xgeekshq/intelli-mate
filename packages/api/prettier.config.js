/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  importOrder: ['<THIRD_PARTY_MODULES>', '', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
}
