export default {
  translation: {
    languages: {
      en: 'EN',
      ru: 'RU',
    },
    labels: {
      title: 'RSS aggregator',
      subtitle: 'Start reading RSS today! It\'s easy, it\'s nicely.',
      example: 'Example: <a href="https://www.exler.ru/blog/rss.xml">https://www.exler.ru/blog/rss.xml</a>',
      posts: 'Posts',
      feeds: 'Feeds',
    },
    formElements: {
      urlInputPlaceholder: 'RSS URL',
    },
    buttons: {
      submit: 'Add',
    },
    yup: {
      field_invalid: 'Incorrect input',
      field_not_url: 'Link must be a valid URL',
      field_required: 'Link is required',
    },
    rss: {
      load_successful: 'RSS load was successful',
    },
    errorMessages: {
      network: {
        general: 'Network Problems. Try again.',
      },
      feed: {
        exists: 'RSS already exists',
        not_valid: 'Not a valid RSS feed',
      },
    },
  },
};
