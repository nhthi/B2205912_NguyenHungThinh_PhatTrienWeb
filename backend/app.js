const express = require("express");
const cors = require("cors");

const app = express();

const ApiError = require("./app/api-error");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Library application." });
});
const bookRoutes = require("./app/routes/book.route");
const authorRoutes = require("./app/routes/author.route");
const categoryRoutes = require("./app/routes/category.route");
const publisherRoutes = require("./app/routes/publisher.route");
const borrowRoutes = require("./app/routes/borrow.route");
const userRouter = require("./app/routes/user.route");
const reportRouter = require("./app/routes/repot.route");
const commentRouter = require("./app/routes/comment.route");

app.use("/api/users", userRouter);
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/comments", commentRouter);
app.use("/api/dashboard", reportRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, `Resource not found`));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
