# ffmpeg-osx

Encode flac, mp3, opus and wav files on OSX with <a href="http://www.evermeet.cx/ffmpeg/" target="_blank">ffmpeg version 2.2.3-tessus for Mac OS X Intel 64bit</a>

## Install

Install with <a href="http://nodejs.org/" target="_blank">npm</a> directly from the <a href="https://github.com/jeromedecoster/ffmpeg-osx" target="_blank">github repository</a>

```
npm install --save-dev jeromedecoster/ffmpeg-osx
```

## API

```js
flac(src, dest, cb(err));
mp3(src, dest, cb(err));
opus(src, dest, cb(err));
wav(src, dest, cb(err));
```

or

```js
flac(src, cb(err));
mp3(src, cb(err));
opus(src, cb(err));
wav(src, cb(err));
```

## Example

```js
var ffmpeg = require('ffmpeg-osx');

function done(err) {
  if (err) throw err;
  console.log('ok, done');
}

ffmpeg.mp3('./source.wav', done);
```

or

```js
var ffmpeg = require('ffmpeg-osx');

function done(err) {
  if (err) throw err;
  console.log('ok, done');
}

ffmpeg.opus('./source.mp3', './dest.opus', done);
```
