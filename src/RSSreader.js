import * as yup from 'yup';
import View from './View.js';
import _ from 'lodash';
import keyBy from 'lodash';

export default class RSSreader {
  constructor() {
  }

  init() {
    const schema = yup.object().shape({
      urlInput: yup.string().required().url(),
    });

    const elements = {        
      form: document.querySelector('[class="rss-form text-body"]'),
      fields: {         
        urlInput: document.getElementById('url-input'),          
      },
      submitButton: document.querySelector('button[type="submit"]'),
    };

    const viewState = View(elements);

    const validate = (fields) => {
        return schema.validate(fields, { abortEarly: false })
    };

    Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
      fieldElement.addEventListener('input', (e) => {
        const { value } = e.target;
        viewState.form.fields[fieldName] = value;
        validate(viewState.form.fields)
        .then(() => { 
          viewState.form.errors = { };
          viewState.form.valid = true;
        })
        .catch((e) => {
          viewState.form.errors = _.keyBy(e.inner, 'path'); /*{ urlInput: e };*/
          viewState.form.valid = _.isEmpty(e);          
        });
      });
    });

    elements.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      viewState.form.processState = 'sending';
      viewState.form.processError = null;
    });
  }
}
