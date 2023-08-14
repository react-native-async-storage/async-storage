module.exports = {
  title: 'Async Storage',
  tagline: 'Data storage system for React Native.',
  url: 'https://react-native-async-storage.github.io',
  baseUrl: '/async-storage/',
  favicon: 'img/favicon.ico',
  organizationName: 'react-native-async-storage',
  projectName: 'async-storage',
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/vsDark'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
      lightTheme: require('prism-react-renderer/themes/vsLight'),
    },
    navbar: {
      title: 'Async Storage',
      logo: {
        alt: 'Async Storage Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          label: 'Docs',
          to: 'docs/install',
          activeBasePath: '/docs',
          position: 'right',
        },
        {
          href: 'https://github.com/react-native-async-storage/async-storage',
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
              href: 'https://github.com/react-native-async-storage/async-storage',
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
            'https://github.com/react-native-async-storage/async-storage/edit/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
