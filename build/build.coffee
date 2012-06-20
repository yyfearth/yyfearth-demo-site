# build tool set

path = require 'path'
fs = require 'fs'
{exec} = require 'child_process'
async = require 'async'
{compress: gzip} = require 'compress-buffer'
xcoffee = require 'extra-coffee-script'
coffeekup = require 'coffeekup'
stylus = require 'stylus'
{cssmin} = require 'cssmin'
#nib = require 'nib'

HEADER = 'demo - yyfearth.com/myyapps.com'

mkdir = (dir, callback) ->
  # console.log 'mkdir', base, _rel
  if callback? # async
    dir = path.resolve dir
    exec "mkdir -p \"#{dir}\"", (err, stdout, stderr) ->
      callback stderr if stderr
      console.log err if err
      unless err
        callback?()
        return
      # fallback use sync
      # mkdir dir
      # callback?()
      throw 'err'
  else
    _rel = path.relative __dirname, dir
    return unless _rel
    _rel = _rel.split /[\\\/]/
    base = [__dirname]
    base.push _rel.shift() while _rel[0] is '..'
    base = path.resolve.apply null, base
    while (r = _rel.shift())
      base = path.join base, r
      fs.mkdirSync base unless path.existsSync base
  return
# end of mkdir

rmdir = (dir, callback) ->
  if callback? # async
    path.exists dir, (exists) ->
      unless exists
        callback?()
        return
      fs.stat dir, (err, stat) ->
        if err then callback err
        unless stat.isDirectory() then callback "Path <#{dir}> is not a directory"
        dir = path.resolve dir
        console.log 'clean:', dir
        exec "rm -rf \"#{dir}\"", (err, stdout, stderr) ->
          callback stderr if stderr
          unless err
            callback?()
            return
          rmdir dir # fallback
  else # sync
    unless path.existsSync dir
      # console.log 'Directory <#{dir}> does not exist'
      return false
    
    stat = fs.statSync dir
    unless stat.isDirectory() then callback "Path <#{dir}> is not a directory"

    do act = (dir) ->
      names = fs.readdirSync dir

      for name in names
        filePath = path.join dir, name

        do (filePath) ->
          stat = fs.statSync filePath

          if stat.isFile()
            # console.log "Delete #{filePath}"
            fs.unlinkSync filePath
          else if stat.isDirectory()
            act filePath

      # console.log "Remove #{dir}"
      fs.rmdirSync dir
  return
# end of rmdir

cpdir = (from, to, callback) ->
  # do not copy sub dirs for now
  fs.readdir from, (err, files) ->
    throw err if err
    async.map files, (name, callback) ->
      # console.log 'find', name
      src = path.join from, name
      fs.stat src, (err, stats) ->
        if stats.isDirectory()
          # console.log 'is dir', name
          callback null
        else
          console.log 'copy file', name
          fs.readFile src, 'binary', (err, data) ->
            # console.log 'read', data.length
            des = path.join to, name
            write des, data,
              encoding: 'binary'
              callback: -> callback null,
                filename: name
                data: new Buffer data, 'binary'
        return
    , (err, data) ->
      callback? err, data
  return
# end of cpdir

gzdir = (files, callback) ->
  if callback?
    async.forEach files, (f, c) ->
      throw 'file.data is not a buffer' unless Buffer.isBuffer f.data
      async.nextTick ->
        f.size = f.data.length
        f.data = gz f.data
        f.gz = 1
        c()
    , (err) -> callback? err, files
    return
  else
    files.forEach (f) ->
      throw 'file.data is not a buffer' unless Buffer.isBuffer f.data
      f.size = f.data.length
      f.data = gz f.data
      f.gz = 1
    files
# end of gzdir

gz = (data, encoding) -> gzip (new Buffer data, encoding), 9

add_header = (filename, data, header = HEADER) ->
  ext = (path.extname filename)[1..].toLowerCase()
  switch ext
    when 'css', 'js'
      return "/*! #{header} */\n#{data}\n"
    when 'html'
      return "#{data}<!-- #{header} -->\n"
    else
      return data
# end of add header

write = (filename, data, {encoding, callback} = {}) ->
  # console.log filename, data.length
  throw 'need filename and data' unless filename and data
  callback = cb if not callback? and typeof (cb = arguments[arguments.length - 1]) is 'function'
  # default encoding is urf-8
  if callback? # async (callback is not func means no callback)
    fs.writeFile filename, data, encoding, (err) ->
      callback? err
  else
    fs.writeFileSync filename, data, encoding
  return
# end of write

load_pkg = (buf) ->
  head_len = 0
  pad_len = 16
  pad_char = 0
  head_len++ while buf[head_len]
  head = buf.toString 'utf-8', 0, head_len
  try
    head = JSON.parse head
  catch e
    throw 'cannot parse package'
  throw 'unacceptable package version ' + head.v unless head.v is 1
  offset = head_len + pad_len
  # test padding
  # console.log buf.toString 'utf-8', head_len, offset
  # for i in [head_len...head_len + pad_len]
  #   throw 'read package error: head padding mismatch' if buf[i] isnt pad_char
  throw 'read package error: head padding mismatch' if buf[offset - 1] isnt pad_char
  # load content
  files = head.files
  for name, file of files = head.files
    if files.hasOwnProperty name
      file.offset += offset
      end = file.offset + file.length
      throw 'read package error: padding mismatch' if buf[end] isnt pad_char
      file.data = buf.slice file.offset, end
      delete file.offset
  files
# end of load package

mime_dict =
  ico  : 'image/x-icon'
  png  : 'image/png'
  js   : 'application/javascript'
  css  : 'text/css'
  htm  : 'text/html'
  html : 'text/html'

get_mime = (filename) ->
  ext = path.extname filename
  mime_dict[ext[1..].toLowerCase()]

build_pkg = (files, {filename, callback} = {}) ->
  throw 'no files' unless files?.length
  head = v: 1, ts: new Date().getTime(), files: {}
  buffer = null
  buf_size = 0
  pad_len = 16
  pad_char = 0
  # files = [ {filename: '', mime: '', size: 0, data: Buffer} ]
  files.forEach (file) ->
    throw 'data should be a gziped buffer' unless file.data and file.gz and Buffer.isBuffer file.data
    len = file.data.length
    head.files[file.filename.toLowerCase()] =
      filename: file.filename
      mime: file.mime or get_mime file.filename
      gz: 1 # force
      offset: buf_size
      length: len # gz length
      size: file.size # orginal size
      ts: file.ts or head.ts
    buf_size += pad_len + len
  head_buf = JSON.stringify head
  head_buf = new Buffer head_buf, 'utf-8'
  head_len = head_buf.length
  buf_size += head_len + 1 # buffer_size already contain an extra pad_len
  buffer = new Buffer buf_size
  # fill buffer
  cur_pos = 0
  # set head to the start of buffer
  head_buf.copy buffer, cur_pos
  cur_pos += head_len
  # set data to buffer with padding
  files.forEach (file) ->
    buffer.fill pad_char, cur_pos, cur_pos + pad_len
    cur_pos += pad_len
    file.data.copy buffer, cur_pos
    cur_pos += file.data.length
  buffer.fill pad_char, buf_size - 1
  # end of set buffer
  if filename
    if callback? # async (callback is not func means no callback)
      fs.writeFile filename, buffer, 'binary', (err) ->
        callback? err
    else
      fs.writeFileSync filename, buffer, 'binary'
  buffer # return
# end of build package

module.exports = {
  async
  mkdir
  rmdir
  gzdir
  write
  cpdir
  add_header
  gz
  load_pkg
  build_pkg
}
