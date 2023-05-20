export default {
  translation: {
    languages: {
      en: 'EN',
      ru: 'RU',
    },
    labels: {
      title: 'RSS агрегатор',
      subtitle: 'Начните читать RSS сегодня! Это легко, это красиво.',
      example: 'Пример: <a href="https://www.exler.ru/blog/rss.xml">https://www.exler.ru/blog/rss.xml</a>',
      posts: 'Посты',
      feeds: 'Фиды',
    },
    formElements: {
      urlInputPlaceholder: 'Ссылка RSS',
    },
    buttons: {
      submit: 'Добавить',
    },
    yup: {
      field_invalid: 'Некорректный формат ввода',
      field_not_url: 'Ссылка должна быть валидным URL',
      field_required: 'Ссылка должна быть указана',
    },
    rss: {
      load_successful: 'RSS успешно загружен',
    },
    errorMessages: {
      network: {
        general: 'Ошибка сети',
      },
      feed: {
        exists: 'RSS уже существует',
        not_valid: 'Ресурс не содержит валидный RSS',
      },
    },
  },
};
