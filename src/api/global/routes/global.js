module.exports = {
  routes: [
    {
      method: "GET",
      path: "/global",
      handler: "global.find",
    },
    {
      method: "PUT",
      path: "/global",
      handler: "global.update",
    },
  ],
};
