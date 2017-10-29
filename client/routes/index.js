import Example from '../views/example';
import Introduce from '../views/introduce';
import Test from '../views/test';


export default [
  { path: '/', component: Example, alias: ['/home'], children: [
    {
      path: '',
      alias: ['introduce'],
      component: Introduce,
    },
    {
      path: 'test',
      component: Test,
    },
  ]},
];

