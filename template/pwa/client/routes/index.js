import Example from '../views/example'


export default [
  { path: '/', component: Example, alias: ['/home'], children: [
    {
      path: '',
      alias: ['introduce'],
      component: () => import('../views/introduce'),
    },
    {
      path: 'test',
      component: () => import('../views/test'),
    },
  ]},
]
