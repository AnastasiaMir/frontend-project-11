/* eslint-disable no-param-reassign */
import fetch from './fetch.js';
import parse from './parse.js';

const updatePosts = (state) => {
  const previousPosts = state.posts.map((post) => post.title);
  state.feeds.map((feed) => fetch(feed.url)
    .then((response) => {
      const currentPosts = parse(response.data.contents).posts;
      const addedPosts = currentPosts.filter((post) => !previousPosts.includes(post.title));
      if (addedPosts.length > 0) {
        const newPosts = addedPosts.map((post) => ({ ...post, feedId: feed.id }));
        state.posts = [...newPosts, ...currentPosts];
      }
    })
    .catch((err) => console.log(err)));
};

export default updatePosts;
