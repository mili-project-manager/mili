export interface Hook {
  name: 'after-init' | 'after-upgrade' | 'after-update' | 'after-checked' | 'after-render' | 'before-init' | 'before-upgrade' | 'before-update' | 'before-checked' | 'before-render'
  exec: string
}
