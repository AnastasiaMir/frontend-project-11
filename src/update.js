/* eslint-disable no-param-reassign */
import fetch from './fetch.js';
import parse from './parse.js';

const updatePosts = (watchedState) => {
  console.log(1);
  const previousPosts = watchedState.posts.map((post) => post.title);
  const promises = watchedState.feeds.map((feed) => fetch(feed.url));
  Promise.all(promises)
    .then((results) => results.forEach((promise) => {
      const { feed, posts } = parse(promise.data.contents);
      const addedPosts = posts.filter((post) => !previousPosts.includes(post.title));
      if (addedPosts.length > 0) {
        const newPosts = addedPosts.map((post) => ({ ...post, feedId: feed.id }));
        watchedState.posts = [...newPosts, ...watchedState.posts];
      }
    }))
    .finally(() => setTimeout(() => updatePosts(watchedState), 5000));
};

export default updatePosts;
