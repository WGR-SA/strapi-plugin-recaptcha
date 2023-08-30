"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch_1 = require("minimatch");
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        const pluginName = 'strapi-plugin-recaptcha';
        console.log('pluginName', pluginName);
        const { config, service } = strapi.plugin(pluginName);
        const request = ctx.request;
        const routes = config('routes') || [];
        // test routes
        let check = false;
        routes.forEach((route) => check = check || ((0, minimatch_1.minimatch)(request.url, route.url) && request.method === route.method));
        // go through recaptcha or not
        if (check)
            await service('validate').test(ctx, next);
        else
            await next();
    };
};
