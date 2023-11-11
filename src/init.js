import _ from 'lodash';
import initView from './view.js';
import validateUrl from './validator.js';

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
  };

  const watchedState = initView(state, elements);

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
        const newFeed = { url, id: _.uniqId };
        watchedState.feeds = [...watchedState.feeds, newFeed];
        watchedState.rssForm.state = 'success';
        return validUrl;
      })
      .catch((error) => {
        watchedState.rssForm.valid = false;
        watchedState.rssForm.error = error;
        console.log(error.message);
        // watchedState.rssForm.state = 'filling'
      });
    watchedState.rssForm.state = 'filling';
  });
};
