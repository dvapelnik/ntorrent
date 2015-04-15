var parseTorrent = require('parse-torrent');

module.exports = function (source, sourceCallback) {
  var parsedTorrent = parsedTorrent(source);

  sourceCallback(parsedTorrent);
};