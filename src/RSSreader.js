export default class RSSreader {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.textContent = 'hello, world!';
    console.log('ehu!');
  }
}
