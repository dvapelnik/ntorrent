var parseTorrent = require('parse-torrent-file');
var fs = require('fs');

var src = '/home/dvapelnik/Work/WebProjects/ua.web.challenge/phpstorm/ntorrent/storage/uploaded/cg2bzrey4fbgyve1kyy5h8iwc7qepef8/1429275002173_[pornoshara.tv].id137669__La_Parrucchiera_al_Mio_Servizio_avi.torrent';
var dst = '/home/dvapelnik/Work/WebProjects/ua.web.challenge/phpstorm/ntorrent/storage/uploaded/cg2bzrey4fbgyve1kyy5h8iwc7qepef8/1429275002173_[pornoshara.tv].id137669__La_Parrucchiera_al_Mio_Servizio_avi___.torrent';

var parsed = parseTorrent(fs.readFileSync(src));
fs.writeFileSync(dst, parseTorrent.encode(parsed));