/* eslint-disable no-param-reassign */
import fetch from './fetch.js';
import parse from './parse.js';

const updatePosts = (state) => {
  const previousPosts = state.posts.map((post) => post.title);
  const promises = state.feeds.map((feed) => fetch(feed.url));
  Promise.all(promises)
    .then((results) => results.forEach((promise) => {
      const { feed, posts } = parse(promise.data.contents);
      const newPosts = posts.filter((post) => !previousPosts.includes(post.title))
        .map((post) => ({ ...post, feedId: feed.id }));
      if (newPosts.length > 0) {
        state.posts = [...newPosts, ...state.posts];
      }
      return state;
    }))
    .finally(() => setTimeout(() => updatePosts(state), 5000));
};

export default updatePosts;
