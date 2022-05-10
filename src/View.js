import onChange from 'on-change';
import _ from 'lodash';

export default (elementsToRender, i18nInstance) => {
  const renderErrors = (elements, errors, prevErrors) => {
    Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
      const error = errors[fieldName];

      const fieldHadError = _.has(prevErrors, fieldName);
      const fieldHasError = _.has(errors, fieldName);

      const feedbackElement = document.querySelector('.feedback');

      if (!fieldHadError && !fieldHasError) {
        return;
      }

      if (fieldHadError && !fieldHasError) {
        fieldElement.classList.remove('is-invalid');
        feedbackElement.textContent = '';
        return;
      }

      if (fieldHadError && fieldHasError) {
        feedbackElement.textContent = error.message;
        return;
      }

      fieldElement.classList.add('is-invalid');

      feedbackElement.textContent = error.message;
    });
  };

  const handleLanguageChange = () => {
    document.querySelector('.lead').textContent = i18nInstance.t('labels.subtitle');
    document.querySelector('h1').textContent = i18nInstance.t('labels.title');
    document.querySelector('[type="submit"]').textContent = i18nInstance.t('buttons.submit');
    document.getElementById('url-input').placeholder = i18nInstance.t('formElements.urlInputPlaceholder');
    document.querySelector('label[for="url-input"]').textContent = i18nInstance.t('formElements.urlInputPlaceholder');
    document.querySelector('#example-url').textContent = i18nInstance.t('labels.example');
  };

  const render = (elements) => (path, value, prevValue) => {
    switch (path) {
      case 'language':
        i18nInstance.changeLanguage(value).then(() => handleLanguageChange());
        break;

      case 'form.valid':
        break;

      case 'form.errors':
        renderErrors(elements, value, prevValue);
        break;

      default:
        break;
    }
  };

  const watchedState = onChange({
    language: '',
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errors: {},
      fields: {
        urlInput: '',
      },
    },
  }, render(elementsToRender));

  return watchedState;
};
