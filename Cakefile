# Requirements & definition
fs = require 'fs'
path = require 'path'
# util = require 'util'
# {exec} = require 'child_process'
build = require './build/build'
# async = build.async

build_cache = (name) ->
  cache_dir = path.join __dirname, 'cache'
  dir = path.join __dirname, name
  fs.mkdir cache_dir, -> build.build_pkg dir,
    filename: (path.join cache_dir, name + '.cache')
    callback: (err) ->
      if err
        console.log name, err
      else
        console.log name, 'cached'

task 'build', 'Build caches to cache', ->
  [
    'baeword'
    'xmlcms'
    'menuwiz'
    'nav-sidebar'
    'index'
  ].forEach build_cache

task 'build:baeword', 'Build baeword.cache to cache', ->
  build_cache 'baeword'

task 'build:xmlcms', 'Build xmlcms.cache to cache', ->
  build_cache 'xmlcms'

task 'build:menuwiz', 'Build menuwiz.cache to cache', ->
  build_cache 'menuwiz'

task 'build:sidebar', 'Build sidebar.cache to cache', ->
  build_cache 'sidebar'

task 'build:index', 'Build index.cache to cache', ->
  build_cache 'index'

# task 'test', 'Run all test cases', ->
