var _ = require('underscore');

module.exports = function (length, isAlphabeticalOnly) {
  length = length || 8;
  isAlphabeticalOnly = isAlphabeticalOnly !== undefined ? isAlphabeticalOnly : false;

  var alphaArray = 'qwertyuiopasdfghjklzxcvbnm'.split('');
  var numArray = '0987654321'.split('');

  var arr = isAlphabeticalOnly ? alphaArray : alphaArray.concat(numArray);

  var result = '';

  _.times(length, function () {
    result += _.sample(arr);
  });

  return result;
};