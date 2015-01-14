# ember-cli-qiniu

Deploy Ember CLI App to Qiniu(http://www.qiniu.com).

1. Creating a build of your Ember CLI App.
2. Uploading to Qiniu.

## Installation

```shell
$ npm install --save-dev ember-cli-qiniu
```

## Setup

### Copy blueprint

```shell
$ ember generate qiniu
```

This task should generate a `qiniu.js` in your App's `config` directory.

### Deploy

```shell
$ ember qiniu
```

It take an optional `--environment=[env]` flag, to determin which env of your `qiniu.js` is used.
Default is `production`.

## Running Tests

* `ember test`
* `ember test --server`

## Building

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
