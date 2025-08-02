// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import BorrowHome from "../views/BorrowHome.vue";
import BooksPage from "../views/BookCatalog.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import BookDetail from "../views/BookDetail.vue";
import UserProfile from "../views/UserProfile.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "BorrowHome",
    component: BorrowHome,
  },
  {
    path: "/books",
    name: "BooksPage",
    component: BooksPage,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/books/:id",
    name: "BookDetail",
    component: BookDetail,
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: UserProfile,
  },
  // router/index.js hoặc router.js
  {
    path: "/admin",
    component: () => import("@/components/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
    children: [
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import("@/views/admin/AdminDashboard.vue"),
      },

      {
        path: "books",
        name: "BookManager",
        component: () => import("@/components/admin/BookManager.vue"),
      },
      {
        path: "books/edit/:id",
        name: "EditBook",
        component: () => import("@/components/admin/EditBook.vue"),
      },
      {
        path: "users",
        name: "UserManagement",
        component: () => import("@/components/admin/UserManagement.vue"),
      },
      {
        path: "users/edit/:id",
        name: "EditUser",
        component: () => import("@/components/admin/EditUser.vue"),
      },
      {
        path: "categories",
        name: "Categories",
        component: () => import("@/components/admin/Categories.vue"),
      },
      {
        path: "categories/edit/:id",
        name: "EditCategories",
        component: () => import("@/components/admin/EditCategories.vue"),
      },
      {
        path: "publishers",
        name: "Publishers",
        component: () => import("@/components/admin/Publishers.vue"),
      },
      {
        path: "publishers/edit/:id",
        name: "EditPublishers",
        component: () => import("@/components/admin/EditPublisher.vue"),
      },
      {
        path: "authors",
        name: "Authors",
        component: () => import("@/components/admin/Authors.vue"),
      },
      {
        path: "authors/edit/:id",
        name: "EditAuthor",
        component: () => import("@/components/admin/EditAuthor.vue"),
      },
      {
        path: "borrows",
        name: "Borrows",
        component: () => import("@/components/admin/BorrowManager.vue"),
      },
      {
        path: "borrows/edit/:id",
        name: "EditBorrow",
        component: () => import("@/components/admin/EditBorrow.vue"),
      },
    ],
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user")); // hoặc lấy từ store Vuex

  if (to.meta.requiresAuth) {
    if (!user) {
      return next("/login"); // chưa đăng nhập
    }

    const userRole = user.role; // ví dụ: "ROLE_STAFF" hoặc "ROLE_READER"

    if (!to.meta.roles.includes(userRole)) {
      return next({ name: "NotFound" });
    }
  }

  next();
});
export default router;
