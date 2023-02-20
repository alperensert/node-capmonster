module.exports = {
  siteMetadata: {
    siteTitle: "node-capmonster Documentation",
    defaultTitle: "node-capmonster",
    siteTitleShort: "node-capmonster",
    siteDescription: `Out of the box Gatsby Theme for creating documentation websites easily and quickly`,
    siteUrl: "https://node-capmonster.alperen.io",
    siteAuthor: "@alperensert",
    siteImage: "/banner.png",
    siteLanguage: "en",
    themeColor: "#8257E6",
    basePath: "/",
},
  plugins: [
    {
      resolve: "@rocketseat/gatsby-theme-docs",
      options: {
          configPath: "src/config",
          docsPath: "src/docs",
          yamlFilesPath: "src/yamlFiles",
          repositoryUrl: "https://github.com/alperensert/node-capmonster",
          baseDir: "docs",
          gatsbyRemarkPlugins: [],
      },
  },
  {
    resolve: "gatsby-plugin-manifest",
    options: {
        name: "Node-Capmonster Docs",
        short_name: "node-capmonster",
        start_url: "/",
        background_color: "#ffffff",
        display: "standalone",
        icon: "static/favicon.png",
    },
},
    `gatsby-plugin-sitemap`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `YOUR_ANALYTICS_ID`,
    //   },
    // },
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: "https://node-capmonster.alperen.io",
      },
    },
    `gatsby-plugin-offline`,
  ],
};
