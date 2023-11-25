import * as yup from 'yup';

const validate = (url, urlsList) => {
  const schema = yup
    .string()
    .trim()
    .required()
    .url()
    .notOneOf(urlsList);

  return schema.validate(url);
};
export default validate;
