const express = require("express");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env")
});
const adminActivityRoute = require("./routes/admin/activity");
const bottomBarRoute = require("./routes/v1/navigation/bottom-bar");
const activityRoute = require("./routes/v1/home/page/activity");
const { renderPage } = require("./views/renderPage");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "..", "public")));
app.use("/v1/home/page/activity", activityRoute);
app.use("/v1/navigation/bottom-bar", bottomBarRoute);
app.use("/admin/activity", adminActivityRoute);

app.get("/", (req, res) => {
  res.send(
    renderPage({
      title: "Server UI",
      heading: "Server-side rendered UI",
      description:
        "This page is rendered on the Node.js server and delivered as HTML.",
      sections: [
        {
          title: "Backend Ready",
          body: "Your SSR backend is running with Express and can render dynamic data into HTML."
        },
        {
          title: "Admin Ready",
          body: "Open /admin/activity to manage the activity page data stored in Postgres."
        }
      ]
    })
  );
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/users/:name", (req, res) => {
  const { name } = req.params;

  res.send(
    renderPage({
      title: `${name} | Server UI`,
      heading: `Welcome, ${name}`,
      description: "This route demonstrates simple server-side dynamic rendering.",
      sections: [
        {
          title: "Requested User",
          body: `The backend rendered this page using the URL parameter "${name}".`
        }
      ]
    })
  );
});

app.use((req, res) => {
  res.status(404).send(
    renderPage({
      title: "Page not found",
      heading: "404",
      description: "The page you requested does not exist.",
      sections: [
        {
          title: "Try again",
          body: "Go back to the homepage or create a new route in src/server.js."
        }
      ]
    })
  );
});

app.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`);
});
