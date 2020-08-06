import random from "../libs/RandomString";

export default class BaseModule {
    constructor(el, factory, name) {
        this.id = random()
        this.name = name
        this.el = el
        this.el.modules = this.el.modules || {}
        this.el.modules[this.name] = this.id
        this.factory = factory
    }
}