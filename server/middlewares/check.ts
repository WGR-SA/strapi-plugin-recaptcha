import {Context, Next, Request} from 'koa';
import {minimatch} from 'minimatch'

export default (config, { strapi })=> {
  return async (ctx: Context, next: Next) => {
    
    const pluginName = 'recaptcha';
    const {config, service} = strapi.plugin(pluginName);
    const request = ctx.request as Request;
    const routes: Request[] = config('routes') || [];

    // test routes
    let check = false;
    routes.forEach((route: Request) => check = check || (minimatch(request.url, route.url) && request.method === route.method));
    
    // go through recaptcha or not
    if(check) await service('validate').test(ctx, next);
    else await next();
  };
};