import convert from 'koa-convert';
import cors from '@koa/cors';
import bodyParser from 'koa-body';
import helmet from 'koa-helmet';
import config from 'config';
import serve from 'koa-static';
import mount from 'koa-mount';
import Router from 'koa-router';

import { cModules, cMiddleware } from '../app';
import { catchErr, statusMessage } from './errorConfig';
import nuxtConfig from './nuxtConfig';

import { todoIndex } from '../app/modules/todo/controller';

function baseConfig(app, io) {
  app.keys = config.get('secret');
  app.proxy = true;

  app.use(mount('/public', serve(config.get('paths.static'))));

  app.use(convert.compose(
    catchErr,
    cors(),
    bodyParser({
      multipart: true,
      formLimit: '200mb'
    }),
    helmet(),
    statusMessage
  ));

  // cModules(app, io);
  // app.use(cMiddleware());

  const router = new Router({
    prefix: '/api/todo'
  });

  router.get('/', todoIndex);

  app
    .use(router.routes())
    .use(router.allowedMethods());

  if (config.get('nuxtBuild')) {
    nuxtConfig(app);
  }
}

export default baseConfig;
