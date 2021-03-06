const licenses = require('./licenses');
const list = [
  { // deit
    _id: 'baseline-1M-deit',
    fileName: 'baseline-1M-deit',
    source: {
      language: 'de'
    },
    target: {
      language: 'it'
    },
    contains: ['europarl-v7', 'jrc3', 'tatoeba', 'TED Talks (wit2012)']
  },
  /*{ // encs
    _id: 'baseline-1M-encs',
    fileName: 'baseline-1M-encs',
    source: {
      language: 'en'
    },
    target: {
      language: 'cs'
    },
    contains: []
  },*/
  { // ende
    _id: 'baseline-1M-ende',
    fileName: 'baseline-1M-ende',
    source: {
      language: 'en'
    },
    target: {
      language: 'de'
    },
    contains: ['europarl-v6', 'europarl-v7', 'jrc3', 'multiUN', 'news-commentary-v11', 'news-commentary-v8', 'TED Talks (wit2012)']
  },
  /*{ // enes
    _id: 'baseline-1M-enes',
    fileName: 'baseline-1M-enes',
    source: {
      language: 'en'
    },
    target: {
      language: 'es'
    },
    contains: []
  },*/
  { // enfr
    _id: 'baseline-1M-enfr',
    fileName: 'baseline-1M-enfr',
    source: {
      language: 'en'
    },
    target: {
      language: 'fr'
    },
    contains: ['tatoeba', 'europarl-v7', 'news-commentary-v8', 'TED Talks (wit2012)']
  },
  /*{ // enhu
    _id: 'baseline-1M-enhu',
    fileName: 'baseline-1M-enhu',
    source: {
      language: 'en'
    },
    target: {
      language: 'hu'
    },
    contains: []
  },*/
  /*{ // enja
    _id: 'baseline-1M-enja',
    fileName: 'baseline-1M-enja',
    source: {
      language: 'en'
    },
    target: {
      language: 'ja'
    },
    contains: []
  },*/
  { // frde
    _id: 'baseline-1M-frde',
    fileName: 'baseline-1M-frde',
    source: {
      language: 'fr'
    },
    target: {
      language: 'de'
    },
    contains: ['DGT', 'europarl-v7', 'jrc3', 'multiUN', 'news-commentary-v7', 'TED Talks (wit2012)']
  },
  { // ennl
    _id: 'baseline-1M-ennl',
    fileName: 'baseline-1M-ennl',
    source: {
      language: 'en'
    },
    target: {
      language: 'nl'
    },
    contains: ['EAC', 'ecb-v01', 'europarl-v7', 'jrc3', 'tatoeba', 'TED Talks (wit2012)']
  },
  { // ensv
    _id: 'baseline-1M-ensv',
    fileName: 'baseline-1M-ensv',
    source: {
      language: 'en'
    },
    target: {
      language: 'sv'
    },
    contains: ['EAC', 'europarl-v3', 'europarl-v6', 'europarl-v7', 'jrc3', 'OPUS-EUbookshop', 'EU Constitution', 'Regeringsförklaringen', 'tatoeba', 'WikiSource']
  },
  /*{ // enzh
    _id: 'baseline-1M-enzh',
    fileName: 'baseline-1M-enzh',
    source: {
      language: 'en'
    },
    target: {
      language: 'zh'
    },
    contains: []
  },*/
  { // frbr
    _id: 'baseline-1M-frbr',
    fileName: 'baseline-1M-frbr',
    source: {
      language: 'fr'
    },
    target: {
      language: 'br'
    },
    contains: []
  },
  { // fres
    _id: 'baseline-1M-fres',
    fileName: 'baseline-1M-fres',
    source: {
      language: 'fr'
    },
    target: {
      language: 'es'
    },
    contains: ['ecb-v01', 'EU Constitution', 'europarl-v7', 'jrc3', 'news-commentary-v7']
  },
  { // enit
    _id: 'baseline-1M-enit',
    fileName: 'baseline-1M-enit',
    source: {
      language: 'en'
    },
    target: {
      language: 'it'
    },
    contains: ['EAC', 'europarl-v7', 'OPUS-EUbookshop', 'jrc3', 'TED Talks (wit2012)']
  },
  { // frit
    _id: 'baseline-1M-frit',
    fileName: 'baseline-1M-frit',
    source: {
      language: 'fr'
    },
    target: {
      language: 'it'
    },
    contains: ['jrc2.2', 'ECB', 'europarl-v7', 'jrc3', 'TED Talks (wit2012)']
  },
  { // frnl
    _id: 'baseline-1M-frnl',
    fileName: 'baseline-1M-frnl',
    source: {
      language: 'fr'
    },
    target: {
      language: 'nl'
    },
    contains: ['ecb-v01', 'europarl-v7', 'jrc3', 'TED Talks (wit2012)']
  }
];

for (let set of list) {
  set.licenses = set.contains.map(file => {
    let license = licenses[file];
    license.fileName = file;
    return license;
  });
}

exports.list = list;
