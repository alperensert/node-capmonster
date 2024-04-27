import type * as Preset from "@docusaurus/preset-classic"
import type { Config } from "@docusaurus/types"
import { themes as prismThemes } from "prism-react-renderer"

const config: Config = {
    title: "node-capmonster",
    tagline: "Dinosaurs are cool",
    favicon: "img/favicon.ico",
    url: "https://node-capmonster.quasm.dev",
    baseUrl: "/",
    organizationName: "alperensert", // Usually your GitHub org/user name.
    projectName: "node-capmonster", // Usually your repo name.
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: "img/docusaurus-social-card.jpg",
        navbar: {
            title: "node-capmonster",
            logo: {
                alt: "Docusaurus Logo",
                src: "img/logo.svg",
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "gettingStartedSidebar",
                    position: "left",
                    label: "Getting Started",
                },
                {
                    to: "/docs/api", // 'api' is the 'out' directory
                    activeBasePath: "docs",
                    label: "API",
                    position: "left",
                },
                {
                    href: "https://github.com/alperensert/node-capmonster",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            copyright: `Copyright © ${new Date().getFullYear()} node-capmonster.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
    plugins: [
        [
            "docusaurus-plugin-typedoc",

            // Plugin / TypeDoc options
            {
                entryPoints: ["../src/index.ts"],
                tsconfig: "../tsconfig.json",
                excludeProtected: true,
                excludePrivate: true,
                sidebar: {
                    position: 99,
                },
            },
        ],
    ],
}

export default config
