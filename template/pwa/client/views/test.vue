<template>
  <div class="page">
    <document-title>Test</document-title>
    <h2>Initial Data Test</h2>
    <nav>
      <router-link class="router-link" to='/test?value=2013'>2013</router-link>
      <router-link class="router-link" to='/test?value=2014'>2014</router-link>
      <router-link class="router-link" to='/test?value=2015'>2015</router-link>
    </nav>
    <p class="display">{{this.isload ? value : 'loading'}}</p>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  initialData: async function ({ store, route }) {
    await store.dispatch('fetchValue', route.query.value || 0)
  },

  computed: {
    ...mapState(['value', 'isload']),
  },
}
</script>
<style lang="postcss" scoped>
.page {
  text-align: center;
}

nav {
  font-size: 0;
}

a {
  margin: 0;
  padding: 8px 12px;
  font-size: 16px;
  text-decoration: none;

  color: #333;
  border: 1px solid #333;
}
</style>
