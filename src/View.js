import _ from 'lodash';

export default (i18nInstance) => {
  const renderErrors = (elements, errors, prevErrors) => {
    Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
      const error = errors[fieldName];
      console.log(errors);

      const fieldHadError = _.has(prevErrors, fieldName);
      const fieldHasError = _.has(errors, fieldName);

      if (!fieldHadError && !fieldHasError) {
        return;
      }

      const feedbackElement = document.querySelector('.feedback');
      feedbackElement.classList.remove('text-success');
      feedbackElement.classList.add('text-danger');

      if (fieldHadError && !fieldHasError) {
        fieldElement.classList.remove('is-invalid');
        feedbackElement.classList.remove('text-danger');
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

  const renderDataFeeds = (feeds) => {
    const feedsContainer = document.querySelector('.feeds');
    feedsContainer.innerHTML = '';

    const card = document.createElement('div');
    card.classList.add('card', 'border-0');

    const сardBody = document.createElement('div');
    сardBody.classList.add('card-body');

    const сardHeader = document.createElement('h2');
    сardHeader.classList.add('card-title', 'h4');
    сardHeader.innerText = i18nInstance.t('labels.feeds');

    const feedsUl = document.createElement('ul');
    feedsUl.classList.add('list-group', 'border-0', 'rounded-0');

    feeds.map((item) => {
      const feedLi = document.createElement('li');
      feedLi.classList.add('list-group-item', 'border-0', 'border-end-0');

      const liTitle = document.createElement('h3');
      liTitle.classList.add('h6', 'm-0');
      liTitle.innerText = item.title;

      const liDescr = document.createElement('p');
      liDescr.classList.add('m-0', 'small', 'text-black-50');
      liDescr.innerText = item.description;

      feedLi.appendChild(liTitle);
      feedLi.appendChild(liDescr);

      feedsUl.appendChild(feedLi);

      return item;
    });

    сardBody.appendChild(сardHeader);
    card.appendChild(сardBody);
    card.appendChild(feedsUl);

    feedsContainer.appendChild(card);
  };

  const renderDataPosts = (posts) => {
    const postsContainer = document.querySelector('.posts');
    postsContainer.innerHTML = '';

    const postsCard = document.createElement('div');
    postsCard.classList.add('card', 'border-0');

    const postsCardBody = document.createElement('div');
    postsCardBody.classList.add('card-body');

    const postCardHeader = document.createElement('h2');
    postCardHeader.classList.add('card-title', 'h4');
    postCardHeader.innerText = i18nInstance.t('labels.posts');

    const postsUl = document.createElement('ul');
    postsUl.classList.add('list-group', 'border-0', 'rounded-0');

    posts.map((item) => {
      const postLi = document.createElement('li');
      postLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const liHref = document.createElement('a');
      liHref.href = item.link;

      if (!item.wasRead) {
        liHref.classList.add('fw-bold');
      }

      if (item.wasRead) {
        liHref.classList.remove('fw-bold');
        liHref.classList.add('fw-normal', 'link-secondary');
      }

      liHref.target = '_blank';
      liHref.rel = 'noopener noreferrer';
      liHref.innerText = item.title;

      const liButton = document.createElement('button');
      liButton.type = 'button';
      liButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      liButton.dataset.bsToggle = 'modal';
      liButton.dataset.bsTarget = '#modal';
      liButton.dataset.link = item.link;
      liButton.innerText = 'Просмотр';

      liButton.addEventListener('click', () => {
        const modalTitle = document.querySelector('.modal-title');
        modalTitle.innerHTML = item.title;

        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = item.description;

        const modalHref = document.querySelector('.full-article');
        modalHref.href = item.link;

        liHref.classList.remove('fw-bold');
        liHref.classList.add('fw-normal', 'link-secondary');
      });

      postLi.appendChild(liHref);
      postLi.appendChild(liButton);

      postsUl.appendChild(postLi);

      return item;
    });

    postsCardBody.appendChild(postCardHeader);
    postsCard.appendChild(postsCardBody);
    postsCard.appendChild(postsUl);

    postsContainer.appendChild(postsCard);
  };

  const handleLanguageChange = () => {
    document.querySelector('.lead').textContent = i18nInstance.t('labels.subtitle');
    document.querySelector('h1').textContent = i18nInstance.t('labels.title');
    document.querySelector('[type="submit"]').textContent = i18nInstance.t('buttons.submit');
    document.getElementById('url-input').placeholder = i18nInstance.t('formElements.urlInputPlaceholder');
    document.querySelector('label[for="url-input"]').textContent = i18nInstance.t('formElements.urlInputPlaceholder');
    document.querySelector('#example-url').innerHTML = i18nInstance.t('labels.example');
  };

  const handleProcessState = (elements, processState) => {
    const feedbackElement = document.querySelector('.feedback');
    const { submitButton } = elements;
    const { urlInput } = elements.fields;

    switch (processState) {
      case 'sent':
        submitButton.disabled = false;
        urlInput.value = '';

        feedbackElement.classList.add('text-success');
        feedbackElement.classList.remove('text-danger');
        feedbackElement.textContent = i18nInstance.t('rss.load_successful');

        break;

      case 'error':
        submitButton.disabled = false;
        break;

      case 'sending':
        submitButton.disabled = true;
        feedbackElement.textContent = '';
        break;

      case 'filling':
        submitButton.disabled = false;
        break;

      default:
        // https://ru.hexlet.io/blog/posts/sovershennyy-kod-defolty-v-svitchah
        throw new Error(`Unknown process state: ${processState}`);
    }
  };

  const handleProcessError = (error) => {
    console.log(error);
    const feedbackElement = document.querySelector('.feedback');

    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-success');
    feedbackElement.textContent = error;
  };

  const render = (elements) => (path, value, prevValue) => {
    switch (path) {
      case 'language':
        i18nInstance.changeLanguage(value).then(() => handleLanguageChange());
        break;

      case 'data.feeds':
        renderDataFeeds(value);
        break;

      case 'data.posts':
        renderDataPosts(value);
        break;

      case 'form.processState':
        handleProcessState(elements, value);
        break;

      case 'form.processError':
        handleProcessError(value);
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

  return render;
};
