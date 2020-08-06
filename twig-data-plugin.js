const fs = require('fs')

function TwigDataPlugin (options) {
  TwigDataPlugin.dataPath = options
}

TwigDataPlugin.prototype.apply = function (compiler) {
  // ...
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
      const data = JSON.parse(fs.readFileSync(TwigDataPlugin.dataPath, 'utf-8'));
      for (var prop in data) {
        htmlPluginData.plugin.options[prop] = data[prop]
      }
      htmlPluginData.plugin.options.cache = false
      callback(null, htmlPluginData)
    })
  })
}

module.exports = TwigDataPlugin
