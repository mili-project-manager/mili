import { Compile } from '@/interface/handler'


export const compile: Compile = async function(dist, src, filepath, resource) {
  const mili = resource.get('mili')
  if (mili && mili.operation !== 'init') {
    return '/dev/null'
  }
}

