# Requirements & definition
fs = require 'fs'
path = require 'path'
util = require 'util'
build = require './src/modules/build'
async = build.async

_base_ext = (filepath, from, to) -> (path.basename filepath, from) + to
_src_path = (f...) -> path.resolve __dirname, 'src', f...
_server_path = (f...) -> path.resolve __dirname, 'server', f...
_client_path = (f...) -> path.resolve __dirname, 'server', 'public', f...
_out_path = (client, f...) ->
  if client
    _client_path f...
  else
    _server_path f...

_data = (outpath, data) ->
  filename: path.basename outpath
  data: new Buffer data, 'utf-8'

build = ->
  build.rmdir (_server_path '.'), (err) ->
    throw err if err
    console.log 'output dir cleaned'
    # build.mkdir _server_path '.'
    build.mkdir (cl = _client_path '.'), ->
      console.log 'start copy static files'
      build.cpdir (_src_path 'public'), cl, (err, dir_files) ->
        console.log 'static files copied'
        async.parallel [
          (callback) -> stylus 'styles/client.styl', callback
          (callback) -> coffeekup 'views/client.coffee', callback
          (callback) -> coffee 'app.coffee', no, callback
          (callback) -> coffee 'scripts/client.coffee', yes, callback
        ], (err, files) ->
          if err
            console.error 'build failed', err
          else
            # console.log files
            fs.chmod (_server_path 'app.js'), '777' # start up
            files = (files.concat dir_files).filter (f) -> f?.data
            build.gzdir files, (err, files) ->
              throw err if err
              # console.log files
              build.build_pkg files,
                filename: _server_path 'cache.dat'
                callback: ->
                  console.log 'cache data created'
                  console.log 'build done'
              # console.log 'pkg\n', build.load_pkg pkg
# end of build all

task 'build', 'Build everything to ./server/', build

# task 'test', 'Run all test cases', ->
