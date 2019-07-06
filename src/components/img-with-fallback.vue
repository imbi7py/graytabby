<template>
  <img ref="img" :src="src" :width="width" :height="height">
</template>

<script>
  export default {
    props: ['src', 'fallback', 'width', 'height'],
    mounted() {
      let img = this.$refs.img;
      img.onerror = (...args) => {
        img.onerror = () => {
        };
        img.src = this.fallback;
      }
    }
  }
</script>

<style scoped>
</style>
