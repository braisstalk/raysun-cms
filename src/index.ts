export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Auto-configure public API permissions
    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (!publicRole) {
      strapi.log.warn("Public role not found, skipping permission setup");
      return;
    }

    const permissions = [
      "api::global.global.find",
      "api::hero-slide.hero-slide.find",
      "api::hero-slide.hero-slide.findOne",
      "api::page.page.find",
      "api::page.page.findOne",
      "api::product.product.find",
      "api::product.product.findOne",
      "api::news-article.news-article.find",
      "api::news-article.news-article.findOne",
      "api::resource.resource.find",
      "api::resource.resource.findOne",
      "api::job-position.job-position.find",
      "api::job-position.job-position.findOne",
    ];

    for (const action of permissions) {
      const existing = await strapi
        .query("plugin::users-permissions.permission")
        .findOne({ where: { action, role: publicRole.id } });

      if (!existing) {
        await strapi
          .query("plugin::users-permissions.permission")
          .create({ data: { action, role: publicRole.id, enabled: true } });
        strapi.log.info("Permission granted: " + action);
      }
    }

    strapi.log.info("Public API permissions configured");
  },
};
