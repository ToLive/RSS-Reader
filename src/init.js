import RSSreader from './RSSreader.js';

export default () => {
  const element = document.getElementById('point');
  const obj = new RSSreader(element);
  obj.init();
};
