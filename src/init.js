import RSSreader from './RSSreader.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default () => {
  const obj = new RSSreader();
  obj.init();
};
