<template>
  <div class="page-header">
    <PageHeaderWrapper :headers="headers"></PageHeaderWrapper>
    <Nav :headers="headers"></Nav>
  </div>
</template>
<script>
import PageHeaderWrapper from './components/PageHeaderWrapper.vue'
import Nav from './components/Nav.vue'
export default {
  name: 'PageHeader',
  props: {
    headers: {
      type: Object,
      required: true
    }
  },
  components: {
    PageHeaderWrapper,
    Nav
  }
}
</script>
<style lang="stylus" scoped>
  .page-header
    height: 3.4rem;
</style>
