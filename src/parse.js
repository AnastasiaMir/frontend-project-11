export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');
  if (parsedData.querySelector('parsererror')) {
    const parseError = new Error('parseError');
    parseError.type = 'rssNotValid';
    throw parseError;
  }
  const feedTitle = parsedData.querySelector('title').textContent;
  const feedDescription = parsedData.querySelector('description').textContent;
  const items = parsedData.querySelectorAll('item');
  const posts = Array.from(items)
    .map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    }));
  return {
    feed: {
      feedTitle, feedDescription,
    },
    posts,
  };
};
