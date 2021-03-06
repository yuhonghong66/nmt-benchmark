const router = require('express').Router();
const url = require('url');
const multiparty = require('multiparty');
const fs = require('fs');
const nconf = require('nconf');
const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      'timestamp': true,
      'colorize': true
    })
  ]
});

const utils = require('../lib/utils');

const tSystem = require('../lib/translationSystem');
const testOutput = require('../lib/testOutput');
const User = require('../lib/user.js');

const fieldSet = require('../config/systemSubmitForm').systemDescription;
const trainingSets = require('../lib/trainingSets').list;

router.get('/', function (req, res, next) {
  res.render('index', {
    messages: {
      info: req.flash('info')[0],
      warning: req.flash('warning')[0],
      error: req.flash('error')[0]
    }
  });
});

router.get('/info', function (req, res, next) {
  res.render('info', {
    messages: {
      info: req.flash('info')[0],
      warning: req.flash('warning')[0],
      error: req.flash('error')[0]
    }
  });
});

/* TODO
router.get('/about', function (req, res, next) {
  res.render('about', {
    messages: {
      info: req.flash('info')[0],
      warning: req.flash('warning')[0],
      error: req.flash('error')[0]
    }
  });
});
*/

router.get('/api', function (req, res, next) {
  var api = require('../config/api.js').api;
  var githubId = req.user ? req.user.id : undefined;
  User.getUser({githubId: githubId}, function (err, user) {
    var apiKey = user ? user.apiKey : '';
    var server = process.env.NMT_BENCHMAKR_URL;
    api.map(function (entry) {
      if (entry.method === 'GET' && entry.params.length) {
        entry.getParams = '?' + entry.params.map(function (p) { return p + '={' + p + '}'; }).join('&');
      }
      if (entry.endpoint === '/system/upload/') {
        entry.fieldSet = fieldSet;
      }
    });
    res.render('api', {
      messages: {
        info: req.flash('info')[0],
        warning: req.flash('warning')[0],
        error: req.flash('error')[0]
      },
      user: user,
      api: api,
      apiKey: apiKey,
      server: server
    });
  });
});

router.get('/translationSystem/view/:systemId', function (req, res, next) {
  var systemId = req.params.systemId;
  if (systemId) {
    utils.gatherTS(systemId, function (err, data) {
      if (err) {
        logger.warn(systemId, ' - Translation system not found');
        req.flash('warning', res.__('Required translation system not found'));
        res.redirect('/');
      } else {
        data.mode = 'view';
        data.fieldSet = fieldSet;
        data.messages = {
          info: req.flash('info')[0],
          warning: req.flash('warning')[0],
          error: req.flash('error')[0]
        };
        res.render('translationSystem', data);
      }
    });
  } else {
    logger.warn(systemId, ' - Translation system not found');
    req.flash('warning', res.__('Required translation system not found'));
    res.redirect('/');
  }
});

/*
router.get('/translationSystem/edit/:systemId', function (req, res, next) {
  if (!req.user) {
    logger.warn('Unauthenticated user tried to access ' + req.url);
    req.flash('warning', res.__('You cannot edit translation systems submitted by other users'));
    res.redirect('/');
  } else {
    var systemId = req.params.systemId;
    if (systemId) {
      utils.gatherTS(systemId, function (err, data) {
        if (err) {
          logger.warn(systemId, ' - Translation system not found');
          req.flash('warning', res.__('Translation system ' + systemId + ' not found.'));
          res.redirect('/');
        } else {
          data.mode = 'edit';
          data.fieldSet = fieldSet;
          data.allSrc = utils.uniq(res.locals.languagePairs, 'sourceLanguage');
          data.allTgt = utils.uniq(res.locals.languagePairs, 'targetLanguage');
          res.render('translationSystem', data);
        }
      });
    } else {
      logger.warn(systemId, ' - Translation system not found');
      req.flash('warning', res.__('Translation system not found.'));
      res.redirect('/');
    }
  }
});
*/

router.post('/translationSystem/add', function (req, res, next) {
  if (!req.user) {
    logger.warn('Unauthenticated user tried to access ' + req.url);
    req.flash('warning', res.__('<a href="/auth/github">Log in</a> to submit translation systems'));
    res.redirect('/');
  } else {
    var lp = req.body.languagePair || nconf.get('OpenNMTBenchmark:default:LP');
    res.render('translationSystem', {
      fieldSet: fieldSet,
      src: lp.substring(0, 2),
      tgt: lp.substring(2),
      mode: 'create',
      uData: req.user || {},
      messages: {
        info: req.flash('info')[0],
        warning: req.flash('warning')[0],
        error: req.flash('error')[0]
      }
    });
  }
});

router.get('/testSets', function (req, res, next) {
  res.render('testSets', {
    messages: {
      info: req.flash('info')[0],
      warning: req.flash('warning')[0],
      error: req.flash('error')[0]
    }
  });
});

/* TODO
  For instance, training sets are hard-coded rather than retrieved from Amazon bucket
*/
router.get('/trainingSets', function (req, res, next) {
  res.render('trainingSets', {
    trainingSets: trainingSets,
    messages: {
      info: req.flash('info')[0],
      warning: req.flash('warning')[0],
      error: req.flash('error')[0]
    }
  });
});

router.get('/userSystems/:userId', function (req, res, next) {
  var userId = req.params.userId;
  utils.gatherUS(userId, function (err, data) {
    if (err) {
      logger.warning('Unable to gather user system data');
      req.flash('warning', res.__('Unable to gather user system data'));
      res.redirect('/');
    } else {
      data.messages = {
        info: req.flash('info')[0],
        warning: req.flash('warning')[0],
        error: req.flash('error')[0]
      };
      res.render('userSystems', data);
    }
  });
});

module.exports = router;
