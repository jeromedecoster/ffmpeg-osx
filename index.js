var balanced = require('balanced-match');
var exists = require('fs').existsSync;
var extname = require('path').extname;
var ffmpeg = __dirname + '/ffmpeg';
var ffprobe = require('ffprobe-osx');
var moment = require('moment');
var Progress = require('progress');
var spawn = require('child_process').spawn;

var slice = [].slice;

exports.flac = function(src, dest, cb) {
  encode.apply(null, ['flac'].concat(slice.call(arguments)));
}
exports.mp3 = function(src, dest, cb) {
  encode.apply(null, ['mp3'].concat(slice.call(arguments)));
}

exports.opus = function(src, dest, cb) {
  encode.apply(null, ['oga'].concat(slice.call(arguments)));
}

exports.wav = function(src, dest, cb) {
  encode.apply(null, ['wav'].concat(slice.call(arguments)));
}

var bar = new Progress('create file [:bar] :percent', {
    complete: '*'
  , incomplete: ' '
  , width: 30
  , total: 100
  // , clear: true
});

function encode(ext, src, dest, cb) {
  if (arguments.length == 3 && typeof dest == 'function') {
    cb = dest;
    var name = src.substr(0, src.length - extname(src).length);
    dest = name + '.' + ext;
    if (src == dest) {
      dest = name + '2.' + ext;
    }
  }
  if (!exists(src)) {
    cb(new Error('ffmpeg-osx: source not found'));
    return;
  }

  getduration(src, function(err, duration) {
    if (err) cb(err);
    else {
      duration = moment.duration(duration, 'seconds');
      duration = Math.round(duration.asMilliseconds());

      var args = getargs(ext, src, dest);
      var child = spawn(ffmpeg, args);

      child.stderr.on('data', function(buf) {
        var time = balanced('time=', ' ', String(buf)).body;
        percent(time, duration);
      })
      child.on('close', function(code) {
        bar.update(1);
        if (code != 0) var err = new Error('ffmpeg-osx: encoding error');
        cb(err || null);
      });
    }
  });
}

function getduration(src, cb) {
  ffprobe.format(src, function(err, format) {
    if (err) return cb(err);
    cb(null, format.duration);
  });
}

function getargs(ext, src, dest) {
  var args = ['-i', src, '-compression_level', '6', '-acodec'];
  switch(ext) {
    case 'flac':
      args.push('flac');
      break;
    case 'oga':
      args.push('libopus', '-ab', '128k');
      break;
    case 'wav':
      args.push('pcm_s24le');
      break;
    case 'mp3':
      args.push('libmp3lame', '-q:a', '0');
      break;
  }
  args.push('-y', '-v', 'error', '-stats', dest);
  return args;
}

function milliseconds(time) {
  while (time.split('.')[1].length < 3) {
    time = time + '0';
  }
  return moment.duration(time).asMilliseconds()
}

function percent(time, duration) {
  var ratio = milliseconds(time) / duration;

  if (ratio > 1) ratio = 1;
  bar.update(ratio);
}
