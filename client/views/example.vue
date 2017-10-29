<template lang="html">
  <div>
    <article>
      <h1>EXAMPLATE PAGE OF VUE-KOA BOILERPLATE</h1>
      <p>It's time to start doing what you want to do.</p>
      <nav>
        <router-link class="router-link" to='/introduce'>Introduce</router-link>
        <router-link class="router-link" to='/test'>Test</router-link>
      </nav>

      <router-view class="content"></router-view>
    </article>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import titleMixin from 'framework/utils/titleMixin';


export default {
  mixins: [titleMixin],
  title: 'Vue-Koa Boilerplate',
}
</script>

<style lang="scss" scoped>
article {
  padding-top: 60px;

  width: 100%;
  height: 30%;
}

h1 {
  text-align: center;

  margin-bottom: 50px;
}

h3 {
  text-align: center;
  margin-top: 40px;
}

p {
  text-align: center;
}

nav {
  display: block;
  width: 100%;
  text-align: center;

  font-size: 0;
}

.router-link {
  display: inline-block;
  padding: 9px 14px;
  margin: 0;

  color: #333;
  font-size: 14px;
  text-decoration: none;

  background: #fff;
  border: 1px solid #333;
}

.content {
  margin-top: 40px;
}
</style>

