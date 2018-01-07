import Router from 'koa-router';
import faviconRouter from './favicon';
// import childRouter from './child';


const router = new Router();

router
  .use(faviconRouter.routes());
  // .use(childRouter.routes());

export default router;
