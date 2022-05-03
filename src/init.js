import RSSreader from './RSSreader.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default () => {
  const element = document.getElementById('point');
  const obj = new RSSreader(element);
  obj.init();
};
