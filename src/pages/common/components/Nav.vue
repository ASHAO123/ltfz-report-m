<template>
  <div class="nav_con">
    <ul>
      <li v-for="nav of navs"
          :key="nav.name">
        <router-link :to="nav.path"
                     :class="{'current': nav.page === $route.query.page}">
          {{nav.name}}
        </router-link>
      </li>
    </ul>
    <div class="loaction">
      <router-link v-if="headers.location === 1"
                   :to="'/report/aMap/' + this.$route.params.device + '/'+ this.$route.params.userID + '/' + this.$route.params.token + '/' + this.$route.params.friendID"><button class="location-font iconfont">&#xe61c;</button></router-link>
      <router-link v-else
                   to=""><button class="location-font iconfont disable"
                disabled>&#xe61c;</button></router-link>
    </div>
  </div>

</template>
<script>
export default {
  name: 'Nav',
  props: {
    headers: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      navs: [
        { page: 'current', name: this.$t('navbar.current'), path: '/report/current/' + this.$route.params.device + '/' + this.$route.params.userID + '/' + this.$route.params.token + '/' + this.$route.params.friendID },
        { page: 'day', name: '日', path: '/report/day/' + this.$route.params.device + '/' + this.$route.params.userID + '/' + this.$route.params.token + '/' + this.$route.params.friendID },
        { page: 'week', name: '周', path: '/report/week/' + this.$route.params.device + '/' + this.$route.params.userID + '/' + this.$route.params.token + '/' + this.$route.params.friendID },
        { page: 'month', name: '月', path: '/report/month/' + this.$route.params.device + '/' + this.$route.params.userID + '/' + this.$route.params.token + '/' + this.$route.params.friendID },
        { page: 'year', name: '年', path: '/report/year/' + this.$route.params.device + '/' + this.$route.params.userID + '/' + this.$route.params.token + '/' + this.$route.params.friendID }
      ]
    }
  }
}
</script>
<style lang="stylus" scoped>
.nav_con {
  display: flex;
  justify-content: space-around;

  .loaction {
    position: relative;
    top: -0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.1rem;
    width: 1rem;
    height: 1.04rem;
    box-shadow: 0 3px 8px rgba(53, 150, 234, 0.27);
    border-radius: 0.1rem;
    background-color: #fff;

    .location-font {
      display: block;
      font-size: 0.45rem;
      color: #3596ea;
      background: #fff;
      // margin 0 0.2rem
    }

    .disable {
      color: #ccc;
    }
  }

  ul {
    position: relative;
    top: -0.8rem;
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    padding: 0 0.35rem;
    box-shadow: 0 3px 8px rgba(53, 150, 234, 0.27);
    border-radius: 0.1rem;
    background-color: #fff;
    width: 80%;
    height: 1.04rem;

    li {
      width: 20%;
      padding: 0.1rem 0 0 0;
      font-size: 0.26rem;
      font-weight: bold;
      text-align: center;

      a {
        display: block;
        padding: 0 0 0.15rem 0;
        color: #7a7a7a;
      }

      .router-link-exact-active {
        color: #3596ea;
        border-bottom: 0.05rem solid #3596ea;
      }

      a.current {
        color: #3596ea;
        border-bottom: 0.05rem solid #3596ea;
      }
    }
  }
}
</style>
