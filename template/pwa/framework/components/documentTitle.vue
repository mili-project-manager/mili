<template>
  <div style="display: none"></div>
</template>
<script>
export default {
  methods: {
    getTitle: function () {
      return this.$slots.default
        .map(slot => slot.text)
        .join('');
    },
  },

  mounted: function () {
    if (process.env.WEB_CONTAINER !== 'ssr') {
      const title = this.getTitle();
      if (title) document.title = title;
    }
  },

  created: function () {
    if (process.env.WEB_CONTAINER === 'ssr') {
      const title = this.getTitle();
      if (title) this.$ssrContext.title = title;
    }
  }
}
</script>
