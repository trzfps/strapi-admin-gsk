'use strict';

module.exports = strapi => ({
  initialize() {
    const passportMiddleware = strapi.admin.services.passport.init();

    strapi.app.use(passportMiddleware);

    strapi.app.use(async (ctx, next) => {
      if (
        ctx.request.headers.cookie &&
        ctx.request.headers.cookie.token
      ) {
        const token = ctx.request.headers.cookie.token;

        const { payload, isValid } = strapi.admin.services.token.decodeJwtToken(token);

        if (isValid) {
          // request is made by an admin
          const admin = await strapi.query('user', 'admin').findOne({ id: payload.id }, ['roles']);

          if (!admin || !(admin.isActive === true)) {
            return ctx.forbidden('Invalid credentials');
          }

          ctx.state.admin = admin;
          ctx.state.user = admin;
          ctx.state.userAbility = await strapi.admin.services.permission.engine.generateUserAbility(
            admin
          );
          ctx.state.isAuthenticatedAdmin = true;
          return next();
        }
      }

      return next();
    });
  },
});
