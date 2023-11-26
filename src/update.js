/* eslint-disable no-param-reassign */
import fetch from './fetch.js';
import parse from './parse.js';

export default (state) => {
  const previousPosts = state.posts.map((post) => post.title);
  state.feeds.every((feed) => fetch(feed.url)
    .then((response) => {
      const allPosts = parse(response.data.contents).posts;
      const addedPosts = allPosts.filter((post) => !previousPosts.includes(post.title));
      state.posts = [...addedPosts, ...addedPosts];
    })
    .catch((err) => console.log(err)));
};
