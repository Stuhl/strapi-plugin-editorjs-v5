export default {
  "content-api": {
    type: "content-api",
    routes: [
      {
        method : "GET",
        path   : "/link",
        handler: "controller.link",
        config : {
          description: "Get a URL link",
          auth       : false
        }
      },
      {
        method : "POST",
        path   : "/image/byFile",
        handler: "controller.byFile",
        config : {
          auth: false
        }
      },
      {
        method : "POST",
        path   : "/image/byURL",
        handler: "controller.byURL",
        config : {
          auth: false
        }
      }
    ]
  }
}
