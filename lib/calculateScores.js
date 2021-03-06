const tmp = require('tmp');
const fs = require('fs.extra');
const exec = require('child_process').exec;
const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      'timestamp': true,
      'colorize': true
    })
  ]
});
const path = require('path');

const Test = require('./testSet.js');
const Output = require('./testOutput.js');

const MAX_BUFFER = 1024 * 500;

function calculateScores (params, done) {

  var tmpDir;
  var evalTool = params.evalTool;
  var referenceContent;
  var sourceContent;
  var reference;
  var source;
  var scores = {};

  (function createDir () {
    // Create temporary folder for this particular output
    return new Promise(function (resolve, reject) {
      tmp.dir({template: '/tmp/XXXXXXXX'}, function (err, path) {
        if (err) {
          reject('Unable to create folder in /tmp: ' + err);
        } else {
          tmpDir = path;
          resolve();
        }
      });
    });
  })()
  .then(function () {
    return Promise.all([createHypothesis(), createReference(), createSource()]);
  })
  .then(function runScorer() {

    // Run evaluation tool
    var multibleu = path.resolve('scripts', 'multi-bleu.perl');
    var mteval = path.resolve('scripts', 'mteval-v13a.pl');
    var cmd;
    if (evalTool === 'mteval-13a.pl') {
      cmd = ['perl', mteval, '-r', reference, '-s', source, '-t', params.hypothesis, '-b'].join(' ');
    } else {
      cmd = ['perl', multibleu, reference, '<', params.hypothesis].join(' ');
    }
    return new Promise(function (resolve, reject) {
      exec(cmd, {maxBuffer: MAX_BUFFER}, function (err, stdout, stderr) {
        if (err) {
          var e = err.toString().split('\n').filter(function (s) { return s.match(/FATAL/); })[0] || err.toString().split('\n')[1].split(/at \//)[0];
          reject('Unable to run scorer tool. ' + e);
        } else {
          if (evalTool === 'mteval-13a.pl') {
            scores.BLEU = (function () {
              var list = stdout.match(/score = ([0-9.]+) for system/);
              return parseFloat(list[1] * 100).toFixed(2);
            })();
          } else {
            scores.BLEU = (function () {
              var list = stdout.match(/([0-9.]+)/g);
              /*
                There is propably a bug in multi-bleu.perl
                causing scores to have a huge deviation error and tiny score
                like: 0.02 +/- 24.5
                So for instance we're adding score and error
                Otherwise just list[0] should be kept
              */
              return (parseFloat(list[0]) + parseFloat(list[1])).toFixed(2);
            })();
          }
          resolve();
        }
      });
    });
  })
  .then(function saveScores () {
    // Store scores in database
    var query = {_id: params.outputId};
    return new Promise(function (resolve, reject) {
      Output.setScores(query, scores, function (err, output) {
        if (err) {
          reject('Unable to update scores: ' + err);
        } else {
          resolve();
        }
      });
    });
  })
  .then(function cleanUp() {
    // Remove tmp dir
    return new Promise(function (resolve, reject) {
      fs.rmrf(tmpDir, function (err) {
        if (err) {
          reject('Unable to remove temporary folder: ' + err);
        } else {
          resolve();
        }
      });
    });
  })
  .then(function () {
    if (typeof done === 'function') {
      done(null, scores);
    }
    logger.info('Scores successfully added to database');
  })
  .catch(function (error) {
    if (typeof done === 'function') {
      done(error);
    }
    logger.error(error);
  });

  function createHypothesis () {
    // Create link to uploaded hypothesis file in tmp folder
    return new Promise(function (resolve, reject) {
      fs.rename(params.hypothesis, tmpDir + '/hypothesis', function (err, data) {
        if (err) {
          reject('Unable to move hypothesis file: ' + err);
        } else {
          params.hypothesis = tmpDir + '/hypothesis';
          resolve();
        }
      });
    });
  }

  function createReference () {
    // Retrive evalTool and reference content
    var query = {_id: params.referenceId};
    return new Promise(function (resolve, reject) {
      Test.getTestSet(query, function (err, result) {
        if (err) {
          reject('Unable to retrive reference file content: ' + err);
        } else {
          if (!result) {
            reject('Test file not found: ' + params.referenceId);
          } else {
            referenceContent = result.target.content;
            evalTool = evalTool || result.evalTool;
            resolve();
          }
        }
      });
    }).then(function () {
      // Write reference content to file
      reference = tmpDir + '/reference';
      return new Promise(function (resolve, reject) {
        fs.writeFile(reference, referenceContent, function (err) {
          if (err) {
            reject('Unable to write reference content to file: ' + err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  function createSource () {
    // Retrive source content
    if (evalTool === 'multi-bleu') {
      return Promise.resolve();
    } else {
      var query = {_id: params.referenceId};
      return new Promise(function (resolve, reject) {
        Test.getTestSet(query, function (err, result) {
          if (err) {
            reject('Unable to retrive source file content: ' + err);
          } else {
            if (!result) {
              reject('Test file not found: ' + params.referenceId);
            } else {
              sourceContent = result.source.content;
              resolve();
            }
          }
        });
      }).then(function () {
        // Write source content to file
        source = tmpDir + '/source';
        return new Promise(function (resolve, reject) {
          fs.writeFile(source, sourceContent, function (err) {
            if (err) {
              reject('Unable to write source content to file: ' + err);
            } else {
              resolve();
            }
          });
        });
      });
    }
  }
}

module.exports = calculateScores;
