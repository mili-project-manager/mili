<template lang="html">
  <div class='flexbox'>
     <article>
      <h1>EXAMPLATE PAGE OF VUE-KOA BOILERPLATE</h1>
      <p>It's time to start doing what you want to do.</p>
    </article>
  </div>
</template>

<script>
import titleMixin from 'framework/utils/titleMixin';


export default {
  mixins: [titleMixin],
  title: 'Vue-Koa Boilerplate',
}
</script>

<style lang="scss" scoped>
.flexbox {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content:center;
  align-items: center;

  overflow-y: auto;
}

article {
  height: 30%;
}

h1 {
  text-align: center;

  margin-bottom: 50px;
}

p {
  text-align: center;
}
</style>

