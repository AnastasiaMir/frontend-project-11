/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const renderFeeds = (state, elements) => {
  elements.feedsContainer.innerHTML = '';

  const cardEl = document.createElement('div');
  cardEl.classList.add('card', 'border-0');

  const titleEl = document.createElement('h2');
  titleEl.textContent = 'Feeds';
  titleEl.classList.add('card-title', 'h4');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.append(titleEl);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');

  cardEl.append(cardBody, ulEl);

  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h-6', 'm-0');
    feedTitle.textContent = feed.url;
    li.append(feedTitle);
    ulEl.append(li);
  });

  return elements.feedsContainer.append(cardEl);
};

const renderPosts = (state, elements) => {
  elements.posts.innerHTML = '';
};

const renderError = (error, elements) => {
  elements.feedback.textContent = '';
  if (error) {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = error.message;
  }
};

const handleProcessState = (processState, elements) => {
  switch (processState) {
    case 'filling':
      elements.input.readOnly = false;
      elements.button.disabled = false;
      break;
    case 'loading':
      elements.input.readOnly = true;
      elements.button.disabled = true;
      break;
    case 'success':
      elements.input.readOnly = false;
      elements.button.disabled = false;
      elements.form.reset();
      elements.form.focus();
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = 'RSS успешно добавлен!';
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const initView = (state, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'feeds':
      renderFeeds(state, elements);
      break;
    case 'posts':
      // alert('posts');
      renderPosts(state, elements);
      break;
    case 'rssForm.error':
      renderError(value, elements);
      break;
    case 'rssForm.valid':
      if (value === false) {
        elements.input.classList.add('is-invalid');
        return;
      }
      elements.input.classList.remove('is-invalid');
      break;
    case 'rssForm.state':
      handleProcessState(value, elements);
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
});
export default initView;
