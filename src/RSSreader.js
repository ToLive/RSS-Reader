import * as yup from 'yup';
import _ from 'lodash';
import View from './View.js';

export default () => {
  const schema = yup.object().shape({
    urlInput: yup.string().required().url(),
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      urlInput: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const viewState = View(elements);

  const validate = (fields) => schema.validate(fields, { abortEarly: false });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
      const { value } = fieldElement;
      viewState.form.fields[fieldName] = value;
      validate(viewState.form.fields)
        .then(() => {
          viewState.form.errors = { };
          viewState.form.valid = true;
        })
        .catch((error) => {
          viewState.form.errors = _.keyBy(error.inner, 'path');
          viewState.form.valid = false;
        });
    });

    viewState.form.processState = 'sending';
    viewState.form.processError = null;
  });
};
