const express = require("express");

const router = express.Router();

const activityPage = [
  {
    type: "header",
    title: "Activity"
  },
  {
    type: "tabs",
    tabs: ["Upcoming", "Past"]
  },
  {
    type: "card",
    id: "1",
    hasMap: true,
    title: "Bhavna Tenament",
    dateTime: "22 Jan \u2022 7:39 pm",
    amount: "138.75",
    currency: "\u20b9"
  },
  {
    type: "card",
    id: "2",
    icon: "\ud83d\udefa",
    title: "4, Civil Hospital Rd",
    dateTime: "22 Jan \u2022 5:26 pm",
    amount: "0.00",
    status: "Cancelled"
  },
  {
    type: "card",
    id: "3",
    icon: "\ud83d\udefa",
    title: "Dr. Ravindra Lodha",
    dateTime: "22 Jan \u2022 4:17 pm",
    amount: "117.31",
    currency: "\u20b9"
  },
  {
    type: "card",
    id: "4",
    icon: "\ud83c\udfcd\ufe0f",
    title: "Samsung M...",
    dateTime: "2 Jan \u2022 1:19 pm",
    amount: "54.10",
    currency: "$"
  },
  {
    type: "card",
    id: "5",
    icon: "\ud83d\udeb6",
    title: "Walked 2.3 km",
    dateTime: "2 Jan \u2022 1:19 pm",
    amount: "0.00",
    currency: "\u20b9"
  }
];

router.get("/", (req, res) => {
  res.json(activityPage);
});

module.exports = router;
