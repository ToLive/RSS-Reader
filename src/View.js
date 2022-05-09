import onChange from 'on-change';
import _ from 'lodash';

export default (elementsToRender) => {
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

  const render = (elements) => (path, value, prevValue) => {
    switch (path) {
      case 'form.valid':
        break;

      case 'form.errors':
        renderErrors(elements, value, prevValue);
        break;

      default:
        break;
    }
  };

  const state = onChange({
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

  return state;
};
