const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      { path: "/settings", component: () => import("../pages/Settings.vue") },
      { path: "/history", component: () => import("../pages/History.vue") },
      { path: "/help", component: () => import("../pages/Help.vue") },
      { path: "/exit", component: () => import("../pages/Exit.vue") }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  console.log("process.env.MODE", process.env.MODE);
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
