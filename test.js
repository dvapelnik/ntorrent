var bencode = require('bencode');
var generator = require('./server/helpers/generator');

var data = {
  "info": {
    "name": "basePath",
    "files": [
      {"path": "basePath.das", "length": 1231551251},
      {"path": "basePath.da", "length": 1231551251},
      {"path": "basePath.sw", "length": 12315512},
      {"path": "basePath.f3", "length": 12315512},
      {"path": "basePath.g33", "length": 12315512}
    ],
    "private": 1,
    "piece length": 4 * 1024 * 1024,
    "pieces": generator(4550)
  },
  "announce": ["announce"],
  "announce-list": [["announce"], ["dasdasdasa"]],
  "creation date": 1429380844,
  "comment": "Some comment",
  "created by": "dasdadwaD W AWD ADAS DASDsadasdasd",
  "encoding": "UTF-8"
};

console.log(bencode.encode(data).toString());