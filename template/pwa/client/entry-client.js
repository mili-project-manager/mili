// Client entry file
import Vue from 'vue'
import createApp from './createApp'


Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { initialData } = this.$options

    if (initialData) {
      initialData.call(this, {
        store: this.$store,
        route: to,
      })
      .then(next)
      .catch(next)
    } else {
      next()
    }
  }
})

const { app, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

Vue.mixin({
  beforeMount () {
    const { initialData } = this.$options
    if (initialData) {
      initialData.call(this, {
        store: this.$store,
        route: this.$route,
      })
    }
  },
})

app.$mount('#app')
