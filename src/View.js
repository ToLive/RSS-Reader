import onChange from 'on-change';
import _ from 'lodash';

export default (elements) => {
  const renderErrors = (elements, errors, prevErrors) => {
    Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
      const error = errors[fieldName];

      const fieldHadError = _.has(prevErrors, fieldName);
      const fieldHasError = _.has(errors, fieldName);

      if (!fieldHadError && !fieldHasError) {
        return;
      }
  
      if (fieldHadError && !fieldHasError) {
        fieldElement.classList.remove('is-invalid');
        fieldElement.nextElementSibling.remove();
        return;
      }
  
      if (fieldHadError && fieldHasError) {
        const feedbackElement = fieldElement.nextElementSibling;
        feedbackElement.textContent = error.message;
        return;
      }

      fieldElement.classList.add('is-invalid');
      const feedbackElement = document.createElement('div');
      feedbackElement.classList.add('invalid-feedback');
      feedbackElement.textContent = error.message;
      fieldElement.after(feedbackElement);
    });
  };
    
  const render = (elements) => (path, value, prevValue) => {
    switch (path) {
      case 'form.valid':
        elements.submitButton.disabled = !value;
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
  }, render(elements));

  return state;
};