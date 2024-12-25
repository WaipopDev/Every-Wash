var routes = [
  {
    path: "/dashboard",
    name: "menu_dashboard",
    icon: "fas fa-align-right",
    group:1,
    permission:[1,2,3]
  },
  
  {
    path: "/report",
    name: "menu_report",
    icon: "fas fa-file-alt",
    group:1,
    permission:[1,2,3]
  },
  {
    path: "/user",
    name: "menu_user",
    icon: "fas fa-user-alt",
    group:1,
    permission:[1]
  },
  {
    path: "/customer",
    name: "menu_customer",
    icon: "fas fa-users",
    group:2,
    permission:[1]
  },
 
  // {
  //   path: "/chats",
  //   name: "menu_chats",
  //   icon: "fas fa-comments",
  //   group:2,
  //   permission:[1]
  // },
 
  {
    path: "/branch",
    name: "menu_branch",
    icon: "fas fa-map-marked",
    group:3,
    permission:[1]
  },
  {
    path: "/program",
    name: "menu_program",
    icon: "fas fa-list",
    group:3,
    permission:[1]
  },
  {
    path: "/washing_machine",
    name: "menu_washing_machine",
    icon: "fas fa-store",
    group:3,
    permission:[1,2,3]
  },
  // {
  //   path: "/wallet",
  //   name: "menu_wallet",
  //   icon: "fas fa-wallet",
  //   group:4,
  //   permission:[1,2]
  // },
  // {
  //   path: "/promptpay",
  //   name: "Promptpay",
  //   icon: "fas fa-wallet",
  //   group:4,
  //   permission:[1,2]
  // },
  {
    path: "/point_redemtion",
    name: "menu_point_redemtion",
    icon: "fas fa-money-bill-alt",
    group:4,
    permission:[1]
  },
  // {
  //   path: "/promotion",
  //   name: "menu_promotion",
  //   icon: "fas fa-comment-dollar",
  //   group:4,
  //   permission:[1,2]
  // },
  // {
  //   path: "/code_promotion",
  //   name: "menu_code_promotion",
  //   icon: "fas fa-money-bill-alt",
  //   group:4,
  //   permission:[1,2]
  // },
  {
    path: "/set_language",
    name: "menu_set_language",
    icon: "fas fa-language",
    group:5,
    permission:[1]
  },
 
  
];
export default routes;