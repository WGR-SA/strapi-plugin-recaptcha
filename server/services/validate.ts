import { Strapi } from '@strapi/strapi';
import axios from 'axios';
import { Context, Next } from 'koa';

export default ({ strapi }: { strapi: Strapi }) => ({
  async test(ctx, next: Next):Promise<Context | Next> {

    const pluginName = 'strapi-plugin-recaptcha';
    const {config} = strapi.plugin(pluginName);
    const recaptchaToken = ctx.request.body['g-recaptcha-response'];

    try {
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: config('secretKey'),
            response: recaptchaToken,
          },
        }
      );
  
      const { success } = response.data;
      if (success) {
        await next(); // Proceed to the next middleware/route handler
      } else {
        ctx.status = 400;
        ctx.body = { error: 'reCAPTCHA verification failed' };
      }
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }

    return ctx;
  }
});
