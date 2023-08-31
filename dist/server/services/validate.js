"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = ({ strapi }) => ({
    async test(ctx, next) {
        const pluginName = 'strapi-plugin-recaptcha';
        const { config } = strapi.plugin(pluginName);
        const recaptchaToken = ctx.request.body['g-recaptcha-response'];
        try {
            const response = await axios_1.default.post('https://www.google.com/recaptcha/api/siteverify', null, {
                params: {
                    secret: config('secretKey'),
                    response: recaptchaToken,
                },
            });
            const { success } = response.data;
            if (success) {
                await next(); // Proceed to the next middleware/route handler
            }
            else {
                ctx.status = 400;
                ctx.body = { error: 'reCAPTCHA verification failed' };
            }
        }
        catch (error) {
            console.error('reCAPTCHA verification error:', error);
            ctx.status = 500;
            ctx.body = { error: 'Internal server error' };
        }
        return ctx;
    }
});
