import Koa from "koa";
import koaBody from "koa-body";
import Router from "koa-router";

const app = new Koa();
const router = new Router();

const port = 3000;

router.get("/*", async ctx => {
  ctx.body = "Hello World!";
});

app.use(koaBody());
app.use(router.routes());

app.listen(port, () => console.log(`App listening on port ${port}!`));
