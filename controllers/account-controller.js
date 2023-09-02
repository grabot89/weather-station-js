import { userStore } from "../models/user-store.js";

export const accountController = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("station", user.email);
      console.log(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  async getLoggedInUser(request) {
    const userEmail = request.cookies.station;
    return await userStore.getUserByEmail(userEmail);
  },

  async listUsers(request, response) {
    const viewData = {
      title: "List Users",
      users: await userStore.getAllUsers(),
    };
    response.render("list-users", viewData);
  },

  async showUser(request, response) {
    const userId = request.params.userid;
    const user = await userStore.getUserById(userId);
    const viewData = {
      title: "Edit User",
      user: user,
    };
    response.render("user-view", viewData);
  },

  async updateUser(request, response) {
    const userId = request.params.userid;
    console.log("User", userId);
    const updatedUser = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
    };
    console.log("Updated User", updatedUser);
    console.log(`Updating User ${userId}`);
    await userStore.updateUser(userId, updatedUser);
    response.redirect("/dashboard");
  },
};