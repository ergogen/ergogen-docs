const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Ergogen docs',
  tagline: 'Ergonomic keyboard layout generator',
  url: process.env.SITE_URL ?? 'https://ergogen.github.io',
  baseUrl: process.env.BASE_URL ?? '/ergogen-docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ergogen',
  projectName: 'ergogen-docs',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          editUrl: 'https://github.com/ergogen/ergogen-docs/edit/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark'
      },
      navbar: {
        title: 'Ergogen docs',
        logo: {
          alt: 'Ergogen docs logo',
          src: 'img/logo.svg',
        },
        items: [
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: process.env.BASE_URL ?? '/ergogen-docs/',
              },
            ],
          },
          {
            title: 'Absolem',
            items: [
              {
                label: 'Absolem blogpost',
                to: 'https://zealot.hu/absolem/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                to: 'https://discord.gg/nbKcAZB',
              },
            ],
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Ergogen. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        defaultLanguage: 'yaml'
      },
    }),
});
