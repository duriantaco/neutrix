import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "neutrix",
  description: "An easy to use (hopefully) state management library for React",
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Tutorials', link: '/tutorials/' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Action', link: '/guide/action' },
            { text: 'Batching', link: '/guide/batching' },
            { text: 'Best Practices', link: '/guide/best-practises' },
            { text: 'Computed Values', link: '/guide/computed' },
            { text: 'Middleware', link: '/guide/middleware' },
            { text: 'Persistence', link: '/guide/persistence' },
            { text: 'Store Connections', link: '/guide/store-connections' }
          ]
        }
      ],
      '/tutorials/': [
        {
          text: 'Tutorials',
          items: [
            { text: 'Shopping Cart', link: '/tutorials/shopping-cart' },
            { text: 'Todo App', link: '/tutorials/to-do' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'API', link: '/api/' }
          ]
        }
      ],
      '/comparison/': [
        {
          text: 'Comparison',
          items: [
            { text: 'Comparison with Other Libraries', link: '/comparison/comparison' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/duriantaco/neutrix' }
    ]
  }
})