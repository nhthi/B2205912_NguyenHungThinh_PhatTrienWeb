// src/auth.js
import { reactive } from "vue";

export const authState = reactive({
  isLoggedIn: !!localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
});

export function login(user, token) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  authState.isLoggedIn = true;
  authState.user = user;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  authState.isLoggedIn = false;
  authState.user = null;
}
