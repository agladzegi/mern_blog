const isName = new RegExp(/^([A-Z][a-z]+([ ]?[a-z]?['-]?[A-Z][a-z]+)*)$/);

const isEmail = new RegExp(
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
);

const isPassword = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
);

module.exports = {
  isName,
  isEmail,
  isPassword,
};
