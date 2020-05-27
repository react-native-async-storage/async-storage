module.exports = {
  title: 'Async Storage',
  tagline: 'Data storage system for React Native.',
  url: 'https://react-native-community.github.io/async-storage/',
  baseUrl: '/async-storage/',
  favicon: 'img/favicon.ico',
  organizationName: 'react-native-community',
  projectName: 'async-storage',
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/vsDark'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
    },
    navbar: {
      title: 'Async Storage',
      logo: {
        alt: 'Async Storage Logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          label: 'Docs',
          to: 'docs/install',
          activeBasePath: '/docs',
          position: 'right',
        },
        {
          href: 'https://github.com/react-native-community/async-storage',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Installation',
              to: 'docs/install',
            },
            {
              label: 'API reference',
              to: 'docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/PycDts2',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/react-native-community/async-storage',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} React Native Community. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/react-native-community/async-storage/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
