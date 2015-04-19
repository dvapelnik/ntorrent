ngTorrentApp.controller('UploadController', function ($scope,
                                                      $rootScope,
                                                      growl,
                                                      $upload,
                                                      ngProgress,
                                                      $http,
                                                      ErrorVerbosity,
                                                      generator,
                                                      Torrent) {
  var exampleBencodedData = 'd8:announcel8:announcee13:announce-listll8:announceel10:dasdasdasaee7:comment12:Some comment10:created by34:dasdadwaD W AWD ADAS DASDsadasdasd13:creation datei1429380844e8:encoding5:UTF-84:infod5:filesld6:lengthi1231551251e4:path12:basePath.dased6:lengthi1231551251e4:path11:basePath.daed6:lengthi12315512e4:path11:basePath.swed6:lengthi12315512e4:path11:basePath.f3ed6:lengthi12315512e4:path12:basePath.g33ee4:name8:basePath12:piece lengthi4194304e6:pieces4550:fr9ulpjl61kz9oq61w2vgm28b7ma2str292wyvmp6bzq81d6k2m85el1onp7k7okwp297a7dnw6jc8e71jdfb97otyrskjujl2ur5mmw49j3csosvtgoeyk5sbou0czd9tck40dchbbdoy1tsyivzp681xd73b7wkn5u01lf20wjhdolmqmbs6zldok3689d63cvv7sgptxynprx32mj2c77fv39w1uqt3u1s5pg0527yfwe4aq1wy6l9i5s38znnj8jq1jzyk5i5bltin5oufpvfexvhgqeszyhldlqzaj393u70ti9szb5p425inexvkp361lzevbvmd9ri764v00m35xdo5sfk0adya4ocj1gmyst64u76x97fa8ljs7ot4b0i3f3v0smi9mwx5lfllzeodiih44c793abhixv4t3ayu2141bgx60halmxr6v3324zb110fucf62iwa2w50iole2wjm6ov74qnim3tu0q815mqjhao47hovi8kz6lrsz2fneoaoloop0hakiljy3ffq3zz5kbcik9bhkofldruv2evwqqwr2lsinwdg6j4pvo7kp9ekgtk77q0dlcvmmz5i2sunirubj8tk1lxqw7shshjybg31ne5pu698sbxhyivq8qqbem37njd0xqnrp6p7vlgt511of27nzp2sia61yp5ih8m9ewk7dgnl30z56rdapjyy0xejvqw48nbaa8q06shyk5j2at0w3uxxs0f9sut4ipb004qlelwnl3ctlziaocj30uezs5mam7osv7hjwz8vx9j9qf9js2wcwojhdpzxn3hisei3pdcyorjn6z1cpf3qdyp5zcdvo17jy3xz9jky937uim881mrrynvg03q9nuhsc0pkxlwu1jbbpkvsjicpmo405dvg3c73cya5lmhwk0ff69zc4u50h78myma3ov7d4i4edhc9ijg6139htkdywnztq8spclo8lr2dsfi90cy417ua74zh40cdcl6jvcj3d7xtzr6eundbyu6fhuvzud9triwkvx23k13swv14gqvibi3e2w1k55s4ytcvvpwzgnutxf0wt9vq677hmydjmbcslnl4nilhyv4jkk7e05elzdg7d3dm1txt29egfjfl21llxgq4q64tmyly1620535oe6cyjozm6fy5ntsa737n7m6txqjjqdv02h4ao1fskuxwcdptdr4jag5p49qxg0q7yggk3bwe51wm7v3fzymgsin4rc71evvl69n6dfzmk0c3zc5j0qppche1wt9g1dgcnjaszrah1pkis4zdwp44l0mnjd1a62aq15heux4gy6wziz7r1tduy5jiwszxvcwll0dfyae2gf2fj2x846a2hakq45ynt50jyahra9lsiuaue1xd1ua0c0zl8k8993wjaepg4fwamfco6vjlhli2tw8qv2c86mtt07163rqk5wm0b5rcu06q9oj51gq0mdvqvk0t11q7pwxtwl08h1mn7mpabpgycen5audcdbh73ntoqj1hbefl7puq52pwn0zr4ok91hepk80zuz56up1238e2hdhyja9aehdy2l47ucr71eb4uzpgbrkqcx8ssp6a4ldx96xep2dykc1h6x7t0534sgwza5bz95hhdjlq0pqofq1eyctv6gfgiddc23xdcuqs5rajygwdlcgxrb367qh2n7xloorny1uacno3j1nbf4x3tdlel7efxdlo3t20wctdedfwy0uxknqwrq3n88wxf5y78udhitrhf1mj8v95e49e6vlgndqetngsdmd6vl43fbaazekt46tw7mjamicetgdc5ed98u2j2ebr1zyj1qh0ldxx03hhr3avhe4je4g9jgmqb7a7qli88f1m4bjdgzhz7auolqkbkd5hck7u2p13msnirrhtag5fzzh9czogp7omjka6y5hfof07r0w3lu7yxkpvhepcwbyp8gdbalwd5m7l1r22vna2346n5kcw32xp8q5zt19i5ose76qx5k2wlxdk67our6du7s0l325vvirafd6xyxrbr6ft1c7yb0cjemk4nby94e1l2sexmf66p7tfbj9491ytfni8qb9nlvjhxmkxwuupk4hxohk6r8u7isb39db5c4vrmg360f6h5qenxmaxo9hv5jaxbsx4w9mvug2bab7vpv8q8ir1vw6249k3lbm7h072auehe6dj6e7e0jw5428gn47kar40n211gndbrze3pt7emkwfi27p4awspuby1b8887bnuemyynsnbninfm4yiv2raigoyyhh3ravpoaqc2gvh8hqsb7whloo5hn52bdmdin7lr6ea4hz0rgdzxskpmhdsqn6izql8rtluutypvgtq6zflzzz5pbc2r57mx0v35jby9i44dxm1yyrz106hftngu2zinmssin3ybhxss59spf8cpm9bbbms99qcdlwdfglrvbx68gfoqfj4nki6siodbmy07f16u6rvqlh7z0tii3jbnvckbp6hx8n58beku9wcd3gf22l9k53z4uxx11izi5qqopj7xsjt08026y4urpekmw6413xp78f8k4prognjwhuva97wcm2ir71uqzga209gabuqomy91slo2q94bftu54g9aa427qny4cvxif7u9pt879b6znyvk9xaz31g867h0esgq94ziamium9n0ewpszwi7kygc39f5miwcwzr6fy2eew5lxt7fnj85zl22ebxtw4fntqm36f9uneaz2hlh84zqqu6mfh7rcbpob17jhaidcrrdh65sytpkne8ewl2nvo5ee35gerk20mdm6bn9nae1760b514j62n6jdhjvic6p5camtz3kxx8y679et03nzxvilej4ktse3ujehfblpd2ythorw1ej7e1a9tp8ahf9gozqpuimwtkxz15kiapft9n7ffgns0jlfm1jrv0fd71xfro5y6gixqv1uhhdqli3aykqhlnu4gbzp537enq7kstvjcupeq1yibypevgxt2795f6hgvn00qvra0e3yslvx42g7pjizy5l675jw7d5ply0haiethdue4xylr6nwe4d5d92zgl1a985so0drs5965x2hz9dofr0x1go2ou3yrwxrvk8jxyiqmyuh7838cbj4gjakkmlr748j57dqkxylaad9xvl9f9tktt6rop3d6cx34ekkr3zqhzwuz83ylkwodlogjw8qxjwgwlugfte3edwfer0w1g5t66qi3d9ybazde3tgsnk8w9lf1m919hq2mdzqtfihoj2qi6dqpde7xizt9l29kqfstnx3glyfsosvzm93qkrfqm80pqou465t2bnxfng3eqa2v4jf8drd7qclkd70avwq133bfeh2ibrtgftp7r51zhbnpy31b2wpy8aeon7c9utyy2s6g9lyeq1y8ppp9hb24wluk7pcni9cmhoj7ll57z5ijoky17bfp141i69hapgk2pipn3dentjr1ec0fpzpflc8p0tfbwdkyy5q5p9zi1bz5oh9gbzhdt339vkgqse7ufiy2ugnjc21enittmhriwbybuc4vz8holpfrkx6hj21dhwgklp6og07zm6kaqozyuyk2b83dfuqamxiuowsan77vug35mvy4ags45uh84sja6fi4l7j58apz4lqzzj7i16vjkyc9yly9qs94t0gddsylg10smesgyzjiekp27lhhxubo29l18mivgjxpe4vhj45bko1p4sh08ms2hdjy1wuqcin4y7i9bnfipbh2trmfl9lj1w05f5cmrltmk921hhnp4oju2whgb1rsrx8fgde4xrzm7rofy0kanjlablnenauyvd76s47at9iox6fee8qhqj7w51yulme8j4y68w4ny5ruo1xzmiz8hhfv59d6knv16es8ycqzmh7toy6auh13gkx0bsb2e7whyik9amgb7ltwhsszy0ywb517iaeyhv3nu102g3a3eq0f4lxeit4cuuu0lv0qod4de8vs9atuyr4dh3aj8h3u2sbq7wvveja92w3gik7g79ms4x04evpir9uscykiiybv5pio6afnki8ehb7hpqmwbbdv8slgp425tvg7l60opirmzw4m7jjibccrjn5l28ymy9ca5isubrjmsnn93yexzel7cgt1ficx4g7j3nl9zdqkkiez6dk1gz12rpw2j5u2xy5owgfv37dbrrflzpde54gzzowvp81saaqnb3f5fpujd96atk9abhb8tobo3jusm17kx8acuemucr2m7e6doj29sa7bxihh663ycwsw9w9curm1i2qx9h7hv8v92n8enmudedchcerowaechkd1eyrolwhbmxhrb7ue215otmmpihxio1xj3yebhptv1cvf8mzz7uugwxbu2298veev4so7qajdvktdn80z8ftc9v3i883yj9e9uo5tpypzb1jtp4lss4feew440su1ngo1iks90060u9av0ytcw45hgxn8mvwj6lu1frnl79lzzkr828oe0o55xekvava7:privatei1eee';
  var exampleJsonData = {
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

  $scope.uploadType = 'file';
  //$scope.uploadType = 'link';
  //$scope.uploadType = 'bencoded';
  //$scope.uploadType = 'json';

  $scope.email = '';
  $scope.bencodedText = '';

  $scope.uploadTypes = ['file', 'link'];
  $scope.setUploadType = function (uploadType) {
    $scope.uploadType = uploadType;
  };

  $scope.upload = function (files) {
    if (files.length == 1) {
      var file = files[0];
      ngProgress.start();
      $upload
        .upload({url: 'upload/file', file: file})
        .progress(function (event) {
          var progressPercentage = parseInt(100.0 * event.loaded / event.total);
          ngProgress.set(progressPercentage);
        })
        .success(function (data) {
          ngProgress.complete();
          $scope.addToTorrent(new Torrent(data.data));
        })
        .error(function (data) {
          ngProgress.complete();
          if (data.status == 'ERROR') {
            growl.error(ErrorVerbosity[data.code]);
          }
        });
    }
  };

  $scope.uploadTorrent = function (link) {
    ngProgress.start();
    $http.post('upload/link', {link: link})
      .success(function (data) {
        ngProgress.complete();
        $scope.addToTorrent(new Torrent(data.data));
      })
      .error(function (data) {
        ngProgress.complete();
        if (data.status == 'ERROR') {
          growl.error(ErrorVerbosity[data.code]);
        }
      });
  };

  $scope.tryText = function (type) {
    ngProgress.start();

    $http
      .post('/torrent/text', {text: $scope[type + 'Text'], type: type})
      .success(function (data) {
        ngProgress.complete();
        $scope.jsonText = '';
        $scope.addToTorrent(new Torrent(data.data));
      })
      .error(function (data) {
        growl.error(ErrorVerbosity[data.code]);
        ngProgress.complete();
      });
  };

  $scope.setExample = function (type) {
    switch (type) {
    case 'bencoded':
      $scope.bencodedText = exampleBencodedData;
      break;
    case 'json':
      $scope.jsonText = JSON.stringify(exampleJsonData);
      break;
    }
  };

  $scope.clearExample = function (type) {
    switch (type) {
    case 'bencoded':
      $scope.bencodedText = '';
      break;
    case 'json':
      $scope.jsonText = '';
      break;
    }
  };

  $scope.sendFileViaEmail = function (torrent) {
    if ($scope.email) {
      ngProgress.start();
      $http
        .post('/send/mail', {fileName: torrent.name, email: $scope.email})
        .success(function (data) {
          ngProgress.complete();
          growl.success(data.message);
        })
        .error(function (data) {
          ngProgress.complete();
          growl.error(ErrorVerbosity[data.code]);
        });
    } else {
      growl.error('Email not defined');
    }

  };
});