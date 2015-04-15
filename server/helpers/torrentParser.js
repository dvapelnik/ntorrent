var parseTorrent = require('parse-torrent');

module.exports = function (source, sourceCallback) {
  var parsedTorrent = parseTorrent(source);

  sourceCallback(parsedTorrent);
};