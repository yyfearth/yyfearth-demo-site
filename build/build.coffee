# build tool set

path = require 'path'
fs = require 'fs'
{exec} = require 'child_process'
async = require 'async'
{compress: gzip} = require 'compress-buffer'
{cssmin} = require 'cssmin'
#nib = require 'nib'

HEADER = 'demo - yyfearth.com/myyapps.com'

@async = async

@exists = exists = fs.exists or path.exists
@existsSync = existsSync = fs.existsSync or path.existsSync

@mkdir = mkdir = (dir, callback) ->
  # console.log 'mkdir', base, _rel
  dir = path.resolve dir
  exec "mkdir -p \"#{dir}\"", (err, stdout, stderr) ->
    callback stderr if stderr
    console.log err if err
    unless err
      callback?()
      return
    # fallback use sync
    mkdirSync dir
    callback?()
    throw 'err'
  return
# end of mkdir

@mkdirSync = mkdirSync = (dir) ->
  # console.log 'mkdir', base, _rel
  _rel = path.relative __dirname, dir
  return unless _rel
  _rel = _rel.split /[\\\/]/
  base = [__dirname]
  base.push _rel.shift() while _rel[0] is '..'
  base = path.resolve.apply null, base
  while (r = _rel.shift())
    base = path.join base, r
    fs.mkdirSync base unless existsSync base
  return
# end of mkdir sync

@rmdir = rmdir = (dir, callback) ->
  exists dir, (exists) ->
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
        rmdirSync dir # fallback
        callback?()
  return
# end of rmdir

@rmdirSync = rmdirSync = (dir) ->
  unless existsSync dir
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
# end of rmdir sync

@lsdir = lsdir = (dir, callback) -> # fake async
  async.nextTick -> callback lsdirSync dir
  return
# end of lsdir

@lsdirSync = lsdirSync = (dir) -> # sync only
  return null unless existsSync dir
  root = dir
  dir = '.'
  list = []
  do _lsdir = (dir) ->
    # console.log dir
    (fs.readdirSync path.join root, dir).forEach (filename) ->
      return if filename[0] is '.' # ignore hidden files
      filepath = path.join dir, filename
      stats = fs.statSync path.join root, filepath
      if stats.isDirectory()
        _lsdir filepath
      else
        list.push filepath
  list.root = root
  list
# end of lsdir sync

#@batch = batch = (files, func, callback) ->
  # files = [ {filename: '', mime: '', size: 0, data: Buffer} ]

@readdirgz = readdirgz = (list, callback) ->
  root = list.root
  async.map list, (filename, _callback) ->
    filepath = if root then path.join root, filename else filename
    fs.readFile filepath, (err, data) ->
      if err
        _callback err
      else
        size = data.length
        gz = 0
        if (gz_data = gzip data, 9)
          if gz_data.length < data.length
            gz = 1
            data = gz_data
        _callback err, { filename, data, size, gz }
  , callback
  return
# end of read dir

@add_header = (filename, data, header = HEADER) ->
  ext = (path.extname filename)[1..].toLowerCase()
  switch ext
    when 'css', 'js'
      return "/*! #{header} */\n#{data}\n"
    when 'html'
      return "#{data}<!-- #{header} -->\n"
    else
      return data
# end of add header

@write = write = (filename, data, {encoding, callback} = {}) ->
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

@load_pkg = (buf) ->
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
  js  : 'application/javascript;charset=utf-8'
  css : 'text/css;charset=utf-8'
  html: 'text/html;charset=utf-8'
  txt : 'text/plain;charset=utf-8'
  xml : 'text/xml;charset=utf-8'
  png : 'image/png'
  jpg : 'image/jpeg'
  gif : 'image/gif'
  ico : 'image/x-icon'
  bmp : 'image/x-ms-bmp'
  mp3 : 'audio/mpeg'
  ogg : 'audio/ogg'
  wav : 'audio/x-wav'

mime_dict.jpeg = mime_dict.jpg
mime_dict.htm = mime_dict.html

# end of mime_dict

get_mime = (filename) ->
  ext = path.extname filename
  mime_dict[ext[1..].toLowerCase()]

@build_pkg = build_pkg = (files, {filename, callback} = {}) ->
  if typeof files is 'string' # a dir path is given
    files = lsdirSync files
    readdirgz files, (err, files) ->
      if err
        throw err unless callback?
        callback err
      else
        build_pkg files, {filename, callback}
    return
  throw 'no files' unless files?[0]?.filename
  head = v: 1, ts: new Date().getTime(), files: {}
  buffer = null
  buf_size = 0
  pad_len = 16
  pad_char = 0
  # files = [ {filename: '', mime: '', size: 0, data: Buffer} ]
  files.forEach (file) ->
    throw 'data should be a buffer' unless file.data and Buffer.isBuffer file.data
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
