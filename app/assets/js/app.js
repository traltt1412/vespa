import 'babel-polyfill'
import 'normalize-css'
import 'modernizr'
import '../css/app.scss'
import Factory from './libs/Factory'
const FastClick = require('fastclick')
const moduleElements = [...document.querySelectorAll('[data-module]')]
const factory = new Factory()

document.addEventListener('DOMContentLoaded', () => {
  factory.registerModules(moduleElements)
  FastClick.attach(document.body)
  window.factory = factory
  let observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      const rawElements = [m.target, ...m.addedNodes]
      let modifyElements = []
      rawElements.forEach(e => {
        if (e.querySelectorAll) {
          modifyElements = [...modifyElements, ...e.querySelectorAll('[data-module]')]
        }
      })
      const elements = [...rawElements, ...modifyElements].filter(e => e.getAttribute && e.getAttribute('data-module') && !e.modules)
      factory.registerModules(elements)
    })
  })
  observer.observe(document, {
    subtree: true,
    childList: true
  })
})
