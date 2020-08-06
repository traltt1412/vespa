import BaseModule from "./BaseModule";

export default class HelloModule extends BaseModule {
  constructor(el, factory) {
    super(el, factory, 'HelloModule')
    this.register()
  }

  register() {
    console.log('Hello world!')
  }
}
