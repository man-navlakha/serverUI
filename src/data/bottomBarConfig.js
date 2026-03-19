const tabs = [
  {
    key: "Home",
    label: "Home",
    route: "/home",
    icon: {
      library: "Foundation",
      active: "home",
      inactive: "home",
      size: 22
    }
  },
  {
    key: "Services",
    label: "Services",
    route: "/services",
    icon: {
      library: "Fontisto",
      active: "nav-icon-grid",
      inactive: "nav-icon-grid",
      size: 18
    }
  },
  {
    key: "Activity",
    label: "Activity",
    route: "/activity",
    icon: {
      library: "lucide-react-native",
      active: "ReceiptIndianRupee",
      inactive: "ReceiptText",
      size: 20,
      strokeWidth: 2
    }
  },
  {
    key: "Account",
    label: "Account",
    route: "/account",
    icon: {
      library: "Ionicons",
      active: "person-circle",
      inactive: "person-circle-outline",
      size: 22
    },
    showActiveDot: true,
    activeDotColor: "#2D8CFF"
  }
];

const defaultBottomBarConfig = {
  component: "BottomBar",
  indicatorWidth: 64,
  activeColor: "#EDAB0C",
  inactiveColor: "#7F8692",
  container: {
    height: 82,
    paddingBottom: 12,
    backgroundColor: "#ecedff",
    borderTopColor: "#ffffffcc"
  }
};

module.exports = {
  tabs,
  defaultBottomBarConfig
};
