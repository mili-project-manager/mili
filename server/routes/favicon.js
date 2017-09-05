import fs from 'fs';
import chalk from 'chalk';
import Router from 'koa-router';


const router = new Router();


const respondFavicon = async ctx => {
  return new Promise((resolve, reject) => {
    const iconPath = `./client/favicon/${ctx.params.favicon}`;

    fs.exists( iconPath, exists => {
      if (!exists) {
        reject(new Error(`[routes favicon] can not find file ${iconPath}`));
        return;
      }

      fs.readFile(iconPath, (err, data) => {
        if (err) {
          reject(new Error(`[routes favicon] can not read file ${iconPath}`));
          return;
        }

        ctx.body = data;
        ctx.set('Content-Type', 'image/x-ico');

        resolve();
      });
    })
  })
  .catch(err => console.log(chalk.red(err.message)));
};

router
  .get('/:favicon([^\/]+\\.ico)', respondFavicon)
  .get('/:favicon([^\/]+\\.png)', respondFavicon)

export default router;

