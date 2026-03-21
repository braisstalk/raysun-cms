/**
 * Auto-configure public permissions on Strapi bootstrap
 * This runs every time Strapi starts, ensuring API endpoints are accessible
 */
async function setPublicPermissions(strapi) {
  const publicRole = await strapi.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
  });

  if (!publicRole) {
    strapi.log.warn("Public role not found, skipping permission setup");
    return;
  }

  // Define which actions to allow for each content type
  const permissions = [
    // Global (single type) - only find
    { action: "api::global.global.find" },
    // Hero Slide
    { action: "api::hero-slide.hero-slide.find" },
    { action: "api::hero-slide.hero-slide.findOne" },
    // Page
    { action: "api::page.page.find" },
    { action: "api::page.page.findOne" },
    // Product
    { action: "api::product.product.find" },
    { action: "api::product.product.findOne" },
    // News Article
    { action: "api::news-article.news-article.find" },
    { action: "api::news-article.news-article.findOne" },
    // Resource
    { action: "api::resource.resource.find" },
    { action: "api::resource.resource.findOne" },
    // Job Position
    { action: "api::job-position.job-position.find" },
    { action: "api::job-position.job-position.findOne" },
  ];

  // Check existing permissions and create missing ones
  for (const perm of permissions) {
    const existing = await strapi.query("plugin::users-permissions.permission").findOne({
      where: {
        action: perm.action,
        role: publicRole.id,
      },
    });

    if (!existing) {
      await strapi.query("plugin::users-permissions.permission").create({
        data: {
          action: perm.action,
          role: publicRole.id,
          enabled: true,
        },
      });
      strapi.log.info(`✅ Permission granted: ${perm.action}`);
    }
  }

  strapi.log.info("✅ Public API permissions configured successfully");
}

module.exports = setPublicPermissions;
