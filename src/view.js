/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const renderFeeds = (state, elements, i18n) => {
  elements.feedsContainer.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const title = document.createElement('h2');
  title.textContent = i18n.t('feeds');
  title.classList.add('card-title', 'h4');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.append(title);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  card.append(cardBody, ul);

  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h-6', 'm-0');
    feedTitle.textContent = feed.feed.feedTitle;
    const feedDescription = document.createElement('p');
    feedDescription.textContent = feed.feed.feedDescription;
    feedDescription.classList.add('m-0', 'text-black-50', 'small');
    li.append(feedTitle, feedDescription);
    ul.append(li);
  });

  return elements.feedsContainer.append(card);
};

const renderPosts = (state, elements, i18n) => {
  elements.postsContainer.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const title = document.createElement('h2');
  title.textContent = i18n.t('posts');
  title.classList.add('card-title', 'h4');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.append(title);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  state.posts.forEach((post) => {
    const classVisited = state.visitedPosts.includes(post.id) ? 'fw-normal link-secondary' : 'fw-bold';
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    li.classList.add('border-0', 'border-end-0', classVisited);

    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.dataset.id = post.title;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;
    li.append(a);

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.title;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18n.t('button');
    li.append(button);

    ul.append(li);
  });

  card.append(cardBody, ul);

  return elements.postsContainer.append(card);
};

const renderError = (error, elements, i18n) => {
  elements.feedback.textContent = '';
  if (error) {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    if (!error.type) {
      elements.feedback.textContent = i18n.t('rssForm.errors.unknownError');
    } else {
      elements.feedback.textContent = i18n.t(`rssForm.errors.${error.type}`);
    }
  }
};

const handleProcessState = (processState, elements, i18n) => {
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
      elements.feedback.textContent = i18n.t('rssForm.success');
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const initView = (state, elements, i18n) => onChange(state, (path, value) => {
  switch (path) {
    case 'feeds':
      renderFeeds(state, elements, i18n);
      break;
    case 'posts':
      // alert('posts');
      renderPosts(state, elements, i18n);
      break;
    case 'rssForm.error':
      renderError(value, elements, i18n);
      break;
    case 'rssForm.valid':
      if (value === false) {
        elements.input.classList.add('is-invalid');
        return;
      }
      elements.input.classList.remove('is-invalid');
      break;
    case 'visitedPosts':
      renderPosts(state, elements, i18n);
      break;
    case 'rssForm.state':
      handleProcessState(value, elements, i18n);
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
});
export default initView;
