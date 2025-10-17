<template>
    <div class="commonForms">
        <div class="commonForms-header">
            <p>我的常用表单</p>
            <el-button link>更多&nbsp;<span>&gt;</span></el-button>
        </div>

        <div class="commonForms-list">
            <div :class="{'commonForms-item': true, 'dept-path': route.path === '/dept/index'}"  v-for="(item, index) in commonFormsList" :key="index">
                <img :src="item.icon">
                <span>{{ item.title}}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()

const commonFormsList = ref([
    {
        title: '浙江大学医学院附属妇产科医院党委用',
        icon: '/img/workbench/commonForms/form.png'
    },
    {
        title: '浙江大学医学院附属妇产科医院国科大',
        icon: '/img/workbench/commonForms/form.png'
    },
    {
        title: '浙江大学医学院附属妇产科医院教育基金会用印...',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '医德医风社会医疗登记流程',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '医院用印申请流程',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '(休)假申请单',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '行玫值班呼叫来院交通补助申请流程',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '员工奖励事由记录确认单',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '麻醉记录单',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '浙江大学医学院附属妇产科医院党委用印申请表',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '行玫值班呼叫来院交通补助申请流程',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '(休)假申请单',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '麻醉记录单',
        icon: '/img/workbench/commonForms/flow.png'
    },
    {
        title: '员工奖励事由记录确认单',
        icon: '/img/workbench/commonForms/flow.png'
    }
])
</script>

<style lang="scss" scoped>
.commonForms {
    height: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;

    .commonForms-header {
        display: flex;
        justify-content: space-between;

        p {
            padding: 12px 8px;
            background-color: #3370FF;
            border-radius: 3px;
            font-weight: bold;
            color: #fff;
        }

        .el-button.is-link {
            font-size: 16px;
            color: #3370FF;

            span {
                transform: translate(0, -2px)
            }
        }
    }

    .commonForms-list {
        display: flex;
        flex-wrap: wrap;
        .commonForms-item {
            flex: 1;
            display: flex;
            align-items: center;
            min-width: 360px;
            height: 48px;
            margin-top: 24px;
            padding: 12px 20px;
            box-sizing: border-box;
            cursor: pointer;

            &:hover {
                background: #F5F9FD;
                border-radius: 8px;
                border: 1px solid #3370FF;
                color: #3370FF;
            }

            img {
                width: 24px;
                margin-right: 8px;
            }

            span {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }

        .dept-path {
            margin-top: 17px;

            &:first-child {
                margin-top: 20px;
            }
        }
    }
}
</style>
