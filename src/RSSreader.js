import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import View from './View.js';
import resources from './locales/index.js';

export default () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  yup.setLocale({
    mixed: {
      default: 'yup.field_invalid',
    },
    string: {
      url: () => ({ key: 'yup.field_not_url' }),
      required: () => ({ key: 'yup.field_required' }),
    },
  });

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

  const viewState = View(elements, i18nInstance);
  viewState.language = defaultLanguage;

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
          const newError = error;

          newError.inner = error.inner.map((err) => {
            const newErr = err;

            newErr.errors = err.errors.map((item) => i18nInstance.t(item.key));
            newErr.message = i18nInstance.t(err.errors[0]);
            return newErr;
          });

          viewState.form.errors = _.keyBy(newError.inner, 'path');
          viewState.form.valid = false;
        });
    });

    viewState.form.processState = 'sending';
    viewState.form.processError = null;
  });
};
