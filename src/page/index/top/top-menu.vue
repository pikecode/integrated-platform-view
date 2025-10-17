<template>
  <el-menu class="top-menu" :default-active="activeIndex" mode="horizontal" text-color="#333">
    <el-menu-item index="0" @click="openHome(itemHome)">
      <template #title>
        <i :class="itemHome.source" style="padding-right: 5px"></i>
        <span>{{ itemHome.name }}</span>
      </template>
    </el-menu-item>
    
    <template v-for="(item, index) in xinhuimedMennus" :key="index">
      <el-menu-item :index="item.path + ''" @click="openXinhuimedMenu(item)">
        <template #title>
          <i :class="item.source" style="padding-right: 5px"></i>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>

    <template v-for="(item, index) in items" :key="index">
      <el-menu-item :index="item.id + ''" @click="openMenu(item)">
        <template #title>
          <i :class="item.source" style="padding-right: 5px"></i>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'top-menu',
  data() {
    return {
      itemHome: {
        name: '首页',
        source: 'iconfont iconicon_work',
      },
      activeIndex: '0',
      items: [],
      xinhuimedMennus: [
        { name: '工作台', path: '/xinhuimed/workbench/index' },
        { name: '门户', path: '/xinhuimed/portal/index' },
        { name: '流程', path: '/xinhuimed/process/index' },
        { name: '应用中心', path: '/xinhuimed/application/index' },
      ]
    };
  },
  inject: ['index'],
  created() {
    this.getMenu();
  },
  computed: {
    ...mapGetters(['tagCurrent', 'menu', 'tagWel']),
  },
  methods: {
    openXinhuimedMenu(item) {
      if(item.path === '/xinhuimed/portal/index') {
        window.open('http://syfbgw.hzboso.com/', '_black')
      } else {
        this.$router.push(item.path);
      }
    },
    openMenu(item) {
      this.index.openMenu(item);
    },
    openHome(itemHome) {
      this.index.openMenu(itemHome);
      this.$router.push(this.tagWel);
    },
    getMenu() {
      this.$store.dispatch('GetTopMenu').then(res => {
        this.items = res;
      });
    },
  },
};
</script>
