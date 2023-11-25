import axios from 'axios';

const proxy = (url) => {
  const newUrl = new URL(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
  return newUrl;
};

export default (url) => {
  const urlProxy = proxy(url);
  return axios.get(urlProxy);
  // .then((data) => console.log(data))
};
