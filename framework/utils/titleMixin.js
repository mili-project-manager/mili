function getTitle(vm) {
  const { title  } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
  }
}

const ssrTitleMixin = {
  created() {
    const title = getTitle(this);
    if (title) this.$ssrContext.title = title;
  }
};

const clientTitleMixin = {
  mounted() {
    const title = getTitle(this);
    if (title) document.title = title;
  }
};


export default process.env.WEB_CONTAINER === 'ssr'
  ? ssrTitleMixin
  : clientTitleMixin;
