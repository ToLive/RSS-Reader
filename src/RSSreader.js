import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import resources from './locales/index.js';
import rssParser from './RSSparser.js';
import view from './View.js';

export default () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();
  let feedsAutoUpdateId;

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
      url: () => ({
        key: 'yup.field_not_url',
      }),
      required: () => ({
        key: 'yup.field_required',
      }),
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
    postButtons: null,
  };

  const errorMessages = {
    network: {
      error: 'Network Problems. Try again.',
    },
    feed: {
      exists: 'RSS already exists',
    },
  };

  const render = view(i18nInstance);

  const watchedState = onChange({
    language: '',
    data: {
      feeds: [],
      posts: [],
      readPosts: [],
    },
    autoupdate: false,
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

  watchedState.language = defaultLanguage;

  const xmlParser = (xmlDocument, type) => {
    const domParser = new DOMParser();

    return domParser.parseFromString(xmlDocument, type);
  };

  const validateFields = () => new Promise((resolve, reject) => {
    schema.validate(watchedState.form.fields, {
      abortEarly: false,
    })
      .then(() => {
        watchedState.form.errors = {};
        watchedState.form.valid = true;
        resolve('validate was successful!');
      })
      .catch((error) => {
        const newError = error;

        newError.inner = error.inner.map((err) => {
          const newErr = err;

          newErr.errors = err.errors.map((item) => i18nInstance.t(item.key));
          newErr.message = i18nInstance.t(err.errors[0]);
          return newErr;
        });

        watchedState.form.errors = _.keyBy(newError.inner, 'path');
        watchedState.form.valid = false;

        reject();
      });
  });

  const updateFeed = (feedUrl, feedId = null, readPosts = []) => {
    const feedsCount = Object.keys(watchedState.data.feeds).length;

    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feedUrl)}`)
      .then((response) => response.data.contents)
      .then((str) => xmlParser(str, 'text/xml'))
      .then((data) => rssParser(data, feedId ?? feedsCount + 1, readPosts))
      .then((parsedData) => {
        console.log(parsedData);

        const feedLink = parsedData.feed.link;

        if (feedId === null) {
          if (watchedState.data.feeds.find((item) => item.link === feedLink)) {
            watchedState.form.errors = i18nInstance.t(errorMessages.feed.exists);
            throw new Error();
          }

          watchedState.data.feeds.push({
            ...parsedData.feed,
            sourceUrl: feedUrl,
          });

          watchedState.autoupdate = true;
        }

        watchedState.data.posts = watchedState.data.posts.filter((item) => item.feedId !== feedId);

        watchedState.data.posts = [...watchedState.data.posts, ...parsedData.posts];

        elements.postButtons = document.querySelectorAll('.list-group-item > button[type="button"]');
        elements.postButtons.forEach((item) => item.addEventListener('click', () => {
          watchedState.data.readPosts.push(item.dataset.link);
        }));

        watchedState.form.processState = 'sent';
        watchedState.form.fields.urlInput = '';
      })
      .catch((error) => {
        console.log(error);
        watchedState.form.processState = 'error';
        watchedState.form.fields.urlInput = '';
        watchedState.form.processError = i18nInstance.t(errorMessages.network.general);
        throw error;
      });
  };

  const feedsAutoUpdate = () => {
    const {
      feeds,
      readPosts,
    } = watchedState.data;

    if (feeds.length > 0) {
      onChange.target(feeds).forEach((feed) => {
        console.log(feed);
        updateFeed(feed.sourceUrl, feed.id, readPosts);
      });
    }

    if (feedsAutoUpdateId) {
      clearTimeout(feedsAutoUpdateId);
    }

    feedsAutoUpdateId = setTimeout(() => {
      console.log('autoupdate loop');
      feedsAutoUpdate();
    }, 5000);
  };

  feedsAutoUpdate();

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    watchedState.form.processState = 'sending';
    watchedState.form.processError = null;

    Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
      const {
        value,
      } = fieldElement;
      watchedState.form.fields[fieldName] = value;
    });

    validateFields()
      .then(() => {
        console.log('validate was successful!');

        watchedState.form.processState = 'sending';

        const feedUrl = watchedState.form.fields.urlInput;

        updateFeed(feedUrl, null, watchedState.data.readPosts);
      })
      .catch((error) => {
        watchedState.form.processState = 'error';
        console.log(error);
        console.log(watchedState);
        console.log('error in validate2!');
      });
  });
};
