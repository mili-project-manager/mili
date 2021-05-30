export const genEvalContent = (resource: string, content: string): string => `
const resource = ${resource};
module.exports = ${content};
`
