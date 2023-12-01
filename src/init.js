/* eslint-disable no-param-reassign */
import _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import initView from './view.js';
import validateUrl from './validator.js';
import ru from './locales/ru.js';
import fetch from './fetch.js';
import parse from './parse.js';
import updatePosts from './update.js';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    postButtons: document.querySelectorAll('.feeds'),
    modal: document.querySelector('#modal'),
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
    modal: null,
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

        const newPosts = posts.map((post) => ({ ...post, feedId: newFeed.id }));

        watchedState.posts = [...newPosts, ...watchedState.posts];
        watchedState.rssForm.error = null;
        watchedState.rssForm.state = 'success';
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          error.type = 'netWorkError';
          watchedState.rssForm.error = error;
        }
        console.log(error);
        watchedState.rssForm.error = error;
        watchedState.rssForm.state = 'filling';
      });
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const visitedPostId = e.target.getAttribute('data-id');
    if (e.target.localName === 'button') {
      watchedState.modal = visitedPostId;
    }
    watchedState.visitedPosts = [...watchedState.visitedPosts, visitedPostId];
  });

  setTimeout(() => updatePosts(watchedState), 5000);
};
