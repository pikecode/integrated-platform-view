<template>
    <div class="container">
      <header>
        <h1>应用中心</h1>
        <p>先进企业协作与管理平台</p>
      </header>
      <div class="main">
        <div class="search">
          <div class="search-title">应用中心</div>
          <el-input
            v-model="value"
            placeholder="请输入应用名称"
            class="input-with-select"
          >
            <template #prepend>
              <el-icon color="#3370FF">
                <Search/>
              </el-icon>
            </template>
            <template #append>
              <el-button type="primary" round>搜索</el-button>
            </template>
          </el-input>
        </div>
        <div class="app">
          <div class="tabs">
            <div :class="{'tab-item': true, active: item.title === active}" v-for="item in tabs" :key="item"
                 @click="handleTab(item.title)">
              {{ item.title }}
            </div>
          </div>
          <div class="footer">
            <div class="apps">
              <div class="app-item" v-for="item in apps" :key="item.title" @click="redirect(item)">
                <div class="logo" :style="{backgroundColor: item.bac}">
                  <img :src="getImg(item)">
                </div>
                <div class="info">
                  <p class="title">{{ item.title }}</p>
                  <p class="describe">{{ item.describe }}</p>
                </div>
              </div>
            </div>
            <el-button v-if="apps.length === 12 && appList.length > 12" type="primary" round @click="showMore(true)">
              更多&nbsp;
              <img src="/img/app/more.png">
            </el-button>
            <el-button v-else-if="appList.length > 12" class="packUp" type="primary" round @click="showMore(false)">
              收起&nbsp;
              <img src="/img/app/more.png">
            </el-button>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useStore } from 'vuex'
  import { cryptoEncrypt } from '@/views/xinhuimed/utils/index'

  const store = useStore()

  const value = ref('')
  const tabs = ref([
    {
      title: '常用应用'
    },
    {
      title: '基础支持'
    },
    {
      title: '医疗管理'
    },
    {
      title: '行政管理'
    },
    {
      title: '资源管理'
    },
    {
      title: '运营管理'
    },
    {
      title: '医技系统'
    },
    {
      title: '临床系统'
    }
  ])
  const active = ref('基础支持')
  const handleTab = (title) => {
    active.value = title
  }

  const appList = ref([
    {
      title: '可视化数据大屏',
      describe: '',
      icon: 'process',
      bac: '#3370FF',
      redirectUri: 'http://visual.xinhuimed.net?ticket='
    },
    {
      title: '督查管理系统',
      describe: '轻量好用的督查管理工具',
      icon: 'task',
      bac: '#6F77EC',
      redirectUri: 'https://bi.hskj.cc/?auth_token='
    },
    {
      title: '制度管理',
      describe: '规章制度统一规范化管理',
      icon: 'reg',
      bac: '#24E120',
      redirectUri: 'http://zhidu.v3.xinhuimed.net//v3/#/login?ticket='
    },
    {
      title: '任务督办管理系统',
      describe: '轻量好用的任务督办管理工具',
      icon: 'reg',
      bac: '#24E120',
      redirectUri: 'http://rwdb.v1.xinhuimed.net/v3/#/login?ticket='
    },
    {
      title: '议事决策管理系统',
      describe: '轻量好用的议事决策管理工具',
      icon: 'reg',
      bac: '#f0e5fc',
      redirectUri: 'http://ysjc.v1.xinhuimed.com/v3/#/login?ticket='
    },
    
    {
      title: 'hams',
      describe: '网站集约化处理',
      icon: 'reg',
      bac: '#24E120',
      redirectUri: 'http://hams.xinhuimed.net/v1/#/login?ticket='
    },
    // {
    //   title: '图表平台',
    //   describe: '提供设计图表的能力，可以按...',
    //   icon: 'chartPlat',
    //   bac: '#3370FF'
    // },
    // {
    //   title: '数字化空间',
    //   describe: '将未来组织与业务全连接，组....',
    //   icon: 'digitalSpace',
    //   bac: '#14C0FF'
    // },
    // {
    //   title: '认证管理',
    //   describe: '管理认证信息相关内容',
    //   icon: 'authentication',
    //   bac: '#3370FF'
    // },
    // {
    //   title: '排班管理',
    //   describe: '排班管理，节假日管理等功能',
    //   icon: 'scheduling',
    //   bac: '#00D6B9'
    // },
    // {
    //   title: '数据任务管理',
    //   describe: '',
    //   icon: 'dataTask',
    //   bac: '#A45EEB'
    // },
    // {
    //   title: 'KGP知识图谱',
    //   describe: '提高认知智能，赋能智慧组织...',
    //   icon: 'KGP',
    //   bac: '#FF8800'
    // },
    // {
    //   title: '日程管理',
    //   describe: '',
    //   icon: 'schedule',
    //   bac: '#14C0FF'
    // },
    // {
    //   title: '数字化空间',
    //   describe: '将未来组织与业务全连接，组....',
    //   icon: 'digitalSpace',
    //   bac: '#14C0FF'
    // },
    // {
    //   title: '认证管理',
    //   describe: '管理认证信息相关内容',
    //   icon: 'authentication',
    //   bac: '#3370FF'
    // },
    // {
    //   title: '排班管理',
    //   describe: '排班管理，节假日管理等功能',
    //   icon: 'scheduling',
    //   bac: '#00D6B9'
    // },
    // {
    //   title: '数据任务管理',
    //   describe: '',
    //   icon: 'dataTask',
    //   bac: '#A45EEB'
    // },
    // {
    //   title: 'KGP知识图谱',
    //   describe: '提高认知智能，赋能智慧组织...',
    //   icon: 'KGP',
    //   bac: '#FF8800'
    // },
    // {
    //   title: '流程框架管理',
    //   describe: '',
    //   icon: 'processFramework',
    //   bac: '#3370FF'
    // },
    // {
    //   title: '流程管理',
    //   describe: '',
    //   icon: 'process',
    //   bac: '#3370FF'
    // },
    // {
    //   title: '签署管理',
    //   describe: '营理文件签署相关内容',
    //   icon: 'sign',
    //   bac: '#00D6B9'
    // },
    // {
    //   title: '任务管理',
    //   describe: '轻量好用的团队任务管理工具',
    //   icon: 'task',
    //   bac: '#6F77EC'
    // },
    // {
    //   title: '签署管理',
    //   describe: '营理文件签署相关内容',
    //   icon: 'sign',
    //   bac: '#00D6B9'
    // }
  ])
  const apps = ref([])
  apps.value = appList.value.slice(0, 12)
  const showMore = (flag) => {
    if (flag) {
      apps.value = [...appList.value]
    } else {
      apps.value = appList.value.slice(0, 12)
    }
  
  }
  const getImg = (item) => {
    const src = `/img/app/${item.icon}.png`
    return src
  }

  // 点击应用跳转
  const redirect = (item) => {
    const userInfo = store.getters.userInfo
    window.open(item.redirectUri + `${cryptoEncrypt(userInfo?.account)}`, '_blank')
  }
  
  </script>
  
  <style lang="scss" scoped>
  header {
    height: 212px;
    background-image: url("/img/app/banner.png");
    background-size: 100% 100%;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    h1 {
      margin-bottom: 20px;
      font-size: 36px;
      font-weight: bold;
    }
  
  
  }
  
  .main {
    max-width: 1440px;
    margin: 20px auto 0;
    padding: 0 20px;
  
    .search {
      display: flex;
      justify-content: space-between;
      align-items: center;
  
      .search-title {
        padding-left: 8px;
        border-left: 3px solid #3370FF;
        font-size: 20px;
        font-weight: bold;
      }
  
      .el-input-group {
        width: 560px;
        height: 40px;
        background: #fff;
        border: 1px solid #DDDDDD;
        border-radius: 22px;
        box-sizing: border-box;
  
        :deep(.el-input-group__prepend,) {
          padding-right: 0;
          background: none;
          border: none;
          box-shadow: none
        }
  
        :deep(.el-input__wrapper) {
          padding-left: 10px;
          box-shadow: none
        }
  
        :deep(.el-input-group__append) {
          background: none;
          border: none;
          box-shadow: none;
          width: 80px;
          height: 34px;
          background: #3370FF;
          border-radius: 20px;
          color: #fff;
        }
      }
    }
  
    .app {
      margin-top: 30px;
  
      .tabs {
        display: flex;
  
        .tab-item {
          padding: 10px 24px;
          border-radius: 20px;
          color: #646A73;
          cursor: pointer;
        }
  
        .active {
          background: #3370FF;
          color: #fff;
        }
      }
  
      .footer {
        margin-top: 20px;
        padding: 20px;
        overflow-y: scroll;
        box-sizing: border-box;
  
        .apps {
          display: flex;
          flex-wrap: wrap;
  
          .app-item {
            display: flex;
            align-items: center;
            width: calc(100% / 4 - 20px);
            min-width: 280px;
            height: 76px;
            margin: 0 20px 20px 0;
            padding: 14px 16px;
            box-shadow: 0px 8px 8px 0px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            box-sizing: border-box;
  
            &:nth-child(4n) {
              margin-right: 0;
            }
  
  
            .logo {
              width: 48px;
              height: 48px;
              line-height: 58px;
              text-align: center;
              margin-right: 10px;
              border-radius: 12px;
            }
  
            .info .describe {
              margin-top: 8px;
              color: #646A73;
            }
          }
        }
  
        .el-button {
          width: 132px;
          height: 40px;
          display: block;
          margin: 30px auto 0;
          background: #3370FF;
        }
  
        .packUp img {
          transform: rotate(180deg);
        }
      }
  
    }
  }
  </style>
  