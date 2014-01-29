// Generated by CoffeeScript 1.7.0
(function() {
  var HEADER, async, build_pkg, exec, exists, existsSync, fs, get_mime, get_mime_name, lsdir, lsdirSync, mime_dict, mkdir, mkdirSync, path, read, readFileQ, readdirgz, rmdir, rmdirSync, write, zlib;

  path = require('path');

  fs = require('fs');

  exec = require('child_process').exec;

  zlib = require('zlib');

  async = require('./async');

  HEADER = 'demo - yyfearth.com/myyapps.com';

  this.async = async;

  this.exists = exists = fs.exists || path.exists;

  this.existsSync = existsSync = fs.existsSync || path.existsSync;

  this.mkdir = mkdir = function(dir, callback) {
    dir = path.resolve(dir);
    exec("mkdir -p \"" + dir + "\"", function(err, stdout, stderr) {
      if (stderr) {
        callback(stderr);
      }
      if (err) {
        console.log(err);
      }
      if (!err) {
        if (typeof callback === "function") {
          callback(null);
        }
        return;
      }
      mkdirSync(dir);
      if (typeof callback === "function") {
        callback(null);
      }
      throw 'err';
    });
  };

  this.mkdirSync = mkdirSync = function(dir) {
    var base, r, _rel;
    _rel = path.relative(__dirname, dir);
    if (!_rel) {
      return;
    }
    _rel = _rel.split(/[\\\/]/);
    base = [__dirname];
    while (_rel[0] === '..') {
      base.push(_rel.shift());
    }
    base = path.resolve.apply(null, base);
    while ((r = _rel.shift())) {
      base = path.join(base, r);
      if (!existsSync(base)) {
        fs.mkdirSync(base);
      }
    }
  };

  this.rmdir = rmdir = function(dir, callback) {
    exists(dir, function(exists) {
      if (!exists) {
        if (typeof callback === "function") {
          callback();
        }
        return;
      }
      return fs.stat(dir, function(err, stat) {
        if (err) {
          callback(err);
        }
        if (!stat.isDirectory()) {
          callback("Path <" + dir + "> is not a directory");
        }
        dir = path.resolve(dir);
        console.log('clean:', dir);
        return exec("rm -rf \"" + dir + "\"", function(err, stdout, stderr) {
          if (stderr) {
            callback(stderr);
          }
          if (!err) {
            if (typeof callback === "function") {
              callback();
            }
            return;
          }
          rmdirSync(dir);
          return typeof callback === "function" ? callback() : void 0;
        });
      });
    });
  };

  this.rmdirSync = rmdirSync = function(dir) {
    var act, stat;
    if (!existsSync(dir)) {
      return false;
    }
    stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
      callback("Path <" + dir + "> is not a directory");
    }
    (act = function(dir) {
      var filePath, name, names, _fn, _i, _len;
      names = fs.readdirSync(dir);
      _fn = function(filePath) {
        stat = fs.statSync(filePath);
        if (stat.isFile()) {
          return fs.unlinkSync(filePath);
        } else if (stat.isDirectory()) {
          return act(filePath);
        }
      };
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        filePath = path.join(dir, name);
        _fn(filePath);
      }
      return fs.rmdirSync(dir);
    })(dir);
  };

  this.lsdir = lsdir = function(dir, callback) {
    async.nextTick(function() {
      return callback(lsdirSync(dir));
    });
  };

  this.lsdirSync = lsdirSync = function(dir) {
    var list, root, _lsdir;
    if (!existsSync(dir)) {
      return null;
    }
    root = dir;
    dir = '.';
    list = [];
    (_lsdir = function(dir) {
      return (fs.readdirSync(path.join(root, dir))).forEach(function(filename) {
        var filepath, stats;
        if (filename[0] === '.') {
          return;
        }
        filepath = path.join(dir, filename);
        stats = fs.statSync(path.join(root, filepath));
        if (stats.isDirectory()) {
          return _lsdir(filepath);
        } else {
          return list.push(filepath);
        }
      });
    })(dir);
    list.root = root;
    return list;
  };

  readFileQ = async.queue(function(file, callback) {
    return fs.readFile(file, callback);
  }, 128);

  this.read = read = function(file, callback) {
    return readFileQ.push(file, callback);
  };

  this.readdirgz = readdirgz = function(list, callback) {
    var root;
    root = list.root;
    async.map(list, function(filename, _callback) {
      var filepath;
      filepath = root ? path.join(root, filename) : filename;
      return read(filepath, function(err, data) {
        if (err) {
          return _callback(err);
        } else {
          return fs.stat(filepath, function(err, stats) {
            var gz, mtime, size;
            mtime = stats.mtime.getTime() || 0;
            size = stats.size || data.length;
            gz = 0;
            return zlib.gzip(data, function(err, gz_data) {
              if (gz_data.length < data.length) {
                gz = 1;
                data = gz_data;
              }
              return _callback(err, {
                filename: filename,
                data: data,
                size: size,
                gz: gz,
                mtime: mtime
              });
            });
          });
        }
      });
    }, callback);
  };

  this.add_header = function(filename, data, header) {
    var ext;
    if (header == null) {
      header = HEADER;
    }
    ext = (path.extname(filename)).slice(1).toLowerCase();
    switch (ext) {
      case 'css':
      case 'js':
        return "/*! " + header + " */\n" + data + "\n";
      case 'html':
        return "" + data + "<!-- " + header + " -->\n";
      default:
        return data;
    }
  };

  this.write = write = function(filename, data, _arg) {
    var callback, cb, encoding, _ref;
    _ref = _arg != null ? _arg : {}, encoding = _ref.encoding, callback = _ref.callback;
    if (!(filename && data)) {
      throw 'need filename and data';
    }
    if ((callback == null) && typeof (cb = arguments[arguments.length - 1]) === 'function') {
      callback = cb;
    }
    if (callback != null) {
      fs.writeFile(filename, data, encoding, function(err) {
        return typeof callback === "function" ? callback(err) : void 0;
      });
    } else {
      fs.writeFileSync(filename, data, encoding);
    }
  };

  this.load_pkg = function(buf) {
    var e, files, head, head_len, headers, name, offset, pad_char, pad_len, _get_data, _i, _len, _ref, _ref1;
    head_len = 1;
    pad_len = 16;
    pad_char = 0;
    while (buf[head_len]) {
      head_len++;
    }
    head = buf.toString('utf-8', 1, head_len);
    if ((buf[0] !== (_ref = buf[buf.length - 1]) || _ref !== pad_char)) {
      throw 'read package error: format padding mismatch';
    }
    try {
      head = JSON.parse(head);
    } catch (_error) {
      e = _error;
      throw 'cannot parse package';
    }
    if (head.v !== 2) {
      throw 'unacceptable package version ' + head.v;
    }
    offset = head_len + pad_len;
    if (buf[offset - 1] !== pad_char) {
      throw 'read package error: head padding mismatch';
    }
    _get_data = function(file) {
      var end;
      file.offset += offset;
      end = file.offset + file.length;
      if (buf[end] !== pad_char) {
        throw 'read package error: padding mismatch';
      }
      file.data = buf.slice(file.offset, end);
      delete file.offset;
    };
    if (Array.isArray(head.files)) {
      headers = head.files.shift();
      files = {};
      head.files.forEach(function(f) {
        var file, i, n, _i, _len;
        file = {};
        for (i = _i = 0, _len = headers.length; _i < _len; i = ++_i) {
          n = headers[i];
          file[n] = f[i];
        }
        file.mime = head.mimes[file.mime];
        _get_data(file);
        return files[file.filename] = file;
      });
    } else {
      files = head.files;
      _ref1 = Object.getOwnPropertyNames(files);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        name = _ref1[_i];
        _get_data(files[name]);
      }
    }
    return files;
  };

  mime_dict = {
    js: 'application/javascript;charset=utf-8',
    json: 'application/json;charset=utf-8',
    html: 'text/html;charset=utf-8',
    xml: 'text/xml;charset=utf-8',
    xsl: 'text/xml',
    xsd: 'text/xml',
    css: 'text/css',
    txt: 'text/plain',
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    bmp: 'image/x-ms-bmp',
    mp3: 'audio/mpeg',
    ogg: 'audio/ogg',
    wav: 'audio/x-wav',
    appcache: 'text/cache-manifest',
    0: 'application/octet-stream'
  };

  mime_dict.jpeg = mime_dict.jpg;

  mime_dict.htm = mime_dict.html;

  get_mime_name = function(filename) {
    var ext;
    ext = (path.extname(filename)).slice(1).toLowerCase();
    if (mime_dict.hasOwnProperty(ext)) {
      return ext;
    } else {
      return 0;
    }
  };

  get_mime = function(filename) {
    var ext;
    ext = path.extname(filename);
    return mime_dict[ext.slice(1).toLowerCase()];
  };

  this.build_pkg = build_pkg = function(files, _arg) {
    var buf_size, buffer, callback, cur_pos, filename, head, head_buf, head_len, list, mimes, pad_char, pad_len, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, filename = _ref.filename, callback = _ref.callback;
    if (typeof files === 'string') {
      files = lsdirSync(files);
      readdirgz(files, function(err, files) {
        if (err) {
          if (callback == null) {
            throw err;
          }
          return callback(err);
        } else {
          return build_pkg(files, {
            filename: filename,
            callback: callback
          });
        }
      });
      return;
    }
    if (!(files != null ? (_ref1 = files[0]) != null ? _ref1.filename : void 0 : void 0)) {
      throw 'no files';
    }
    head = {
      v: 2,
      ts: new Date().getTime(),
      files: {}
    };
    buffer = null;
    buf_size = 0;
    pad_len = 16;
    pad_char = 0;
    if (files.length > 16) {
      list = head.files = [['filename', 'mime', 'gz', 'size', 'mtime', 'offset', 'length']];
      mimes = head.mimes = {};
      files.forEach(function(file) {
        var len, mime;
        if (!(file.data && Buffer.isBuffer(file.data))) {
          throw 'data should be a buffer';
        }
        len = file.data.length;
        mime = file.mime || get_mime_name(file.filename);
        if (mimes[mime] == null) {
          mimes[mime] = mime_dict[mime];
        }
        list.push([file.filename, mime, file.gz, file.size, file.mtime, buf_size, len]);
        return buf_size += pad_len + len;
      });
    } else {
      files.forEach(function(file) {
        var len, mime;
        if (!(file.data && Buffer.isBuffer(file.data))) {
          throw 'data should be a buffer';
        }
        len = file.data.length;
        mime = file.mime || get_mime(file.filename);
        head.files[file.filename] = {
          filename: file.filename,
          mime: file.mime || get_mime(file.filename),
          gz: file.gz,
          offset: buf_size,
          length: len,
          size: file.size,
          mtime: file.mtime
        };
        return buf_size += pad_len + len;
      });
    }
    head_buf = new Buffer(JSON.stringify(head), 'utf-8');
    head_len = head_buf.length;
    buf_size += head_len + 2;
    buffer = new Buffer(buf_size);
    buffer.fill(pad_char);
    cur_pos = 1;
    head_buf.copy(buffer, cur_pos);
    cur_pos += head_len;
    files.forEach(function(file) {
      cur_pos += pad_len;
      file.data.copy(buffer, cur_pos);
      cur_pos += file.data.length;
    });
    if (filename) {
      if (callback != null) {
        fs.writeFile(filename, buffer, 'binary', function(err) {
          return typeof callback === "function" ? callback(err) : void 0;
        });
      } else {
        fs.writeFileSync(filename, buffer, 'binary');
      }
    }
    return buffer;
  };

}).call(this);