import Koa from "koa";
import koaBody from "koa-body";
import Router from "koa-router";
import dependencyService from "./services/dependency.service";

const app = new Koa();
const router = new Router();

const port = 3000;
/*
Params:

name - name of dependency
version - version of dependency
depth - tree depth to return
**/
router.get("/*", async ctx => {
  ctx.body = await new dependencyService().getDependencies(
    ctx.query.name,
    ctx.query.version,
    ctx.query.depth
  );
});

app.use(koaBody());
app.use(router.routes());

app.listen(port, () => console.log(`App listening on port ${port}!`));
