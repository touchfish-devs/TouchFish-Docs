import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TouchFish",
  lang: "zh-CN",
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  description: "The website for TouchFish - A FLOSS messaging system!",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/' }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '关于 TouchFish V5', link: '/guide/' },
          { text: '快速开始', link: '/guide/start' },
          { text: '开服指导', link: '/guide/server-setup' },
          { text: '服务器维护', link: '/guide/maintenance' },
          { text: '服务器架构', link: '/guide/architecture' },
          { text: '开发计划', link: '/guide/v5' },
        ]
      },
      {
        text: '文档站',
        items: [
          { text: '文档站点', link: '/doc-site/' },
          { text: 'Markdown 语法', link: '/doc-site/markdown-usage' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/2044-space-elevator/TouchFish' },
      { icon: 'qq', link: 'https://qm.qq.com/q/wmlUpIabfy' }
    ]
  },
    markdown: {
      math: true
    }
})
