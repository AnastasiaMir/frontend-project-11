import _ from 'lodash';
import i18next from 'i18next';
import initView from './view.js';
import validateUrl from './validator.js';
import ru from './locales/ru.js';
import fetch from './fetch.js';
import parse from './parse.js';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  };

  const state = {
    rssForm: {
      state: 'filling',
      error: null,
      valid: true,
    },
    feeds: [],
    posts: [],
    visitedPosts: [],
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = initView(state, elements, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.rssForm.state = 'filling';
    const data = new FormData(e.target);
    const url = data.get('url');
    const urlsList = watchedState.feeds.map((feed) => feed.url);
    validateUrl(url, urlsList)
      .then((validUrl) => {
        watchedState.rssForm.error = null;
        watchedState.rssForm.state = 'loading';
        return fetch(validUrl);
      })
      .then((response) => {
        const { feed, posts } = parse(response.data.contents);
        const newFeed = { feed, id: _.uniqueId, url };
        watchedState.feeds = [...watchedState.feeds, newFeed];

        const newPosts = posts.map((post) => ({ ...post, feedId: newFeed.id, id: _.uniqueId }));

        watchedState.posts = [...newPosts, ...watchedState.posts];
        watchedState.rssForm.error = null;
        watchedState.rssForm.state = 'success';
      })
      .catch((error) => {
        // console.log(error)
        watchedState.rssForm.valid = error.name !== 'ValidationError';
        watchedState.rssForm.error = error;

        watchedState.rssForm.state = 'filling';
      });
  });
};
