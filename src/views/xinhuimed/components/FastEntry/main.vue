<template>
    <div class="fastEntry">
        <div class="fastEntry-header">
            <p>{{ route.path === '/dept/index' ? '常用系统入口' : '快捷入口' }}</p>
            <el-button link>更多&nbsp;<span>&gt;</span></el-button>
        </div>

        <div class="fastEntry-list">
            <div :class="{'fastEntry-item': true, 'deptPath': route.path === '/dept/index'}" v-for="(item, index) in fastEntryList" :key="index">
                <div class="image" :style="{'background-color': item.bgc}">
                    <img :src="item.icon">
                </div>
                <span>{{ item.title }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()

const fastEntryList = ref([
    {
        "title": '一体化综合平台(美化)',
        icon: '/img/fastEntry/integratedPlatform.png',
        bgc: '#dee8ff'
    },
    {
        "title": '人事管理系统',
        icon: '/img/fastEntry/personnelMatters.png',
        bgc: '#d9f5ff'
    },
    {
        "title": '知识库-it场景落地',
        icon: '/img/fastEntry/knowledgebaseItScenarioLanding.png',
        bgc: '#d7f8f4'
    },
    {
        "title": '科教管理系统',
        icon: '/img/fastEntry/scienceEducation.png',
        bgc: '#f0e5fc'
    },
    {
        "title": '医疗质量+质控BI',
        icon: '/img/fastEntry/qualityControl.png',
        bgc: '#d9f5ff'
    },
    {
        "title": '任务督办管理系统',
        icon: '/img/fastEntry/taskSupervision.png',
        bgc: '#dcfada'
    },
    {
        "title": '参观管理系统',
        icon: '/img/fastEntry/visits.png',
        bgc: '#dee8ff'
    },
    {
        "title": '公文管理系统',
        icon: '/img/fastEntry/document.png',
        bgc: '#d7f8f4'
    },
    {
        "title": '等级医院评审系统',
        icon: '/img/fastEntry/levelReview.png',
        bgc: '#ffecd5'
    },
    {
        "title": '合同管理系统',
        icon: '/img/fastEntry/contract.png',
        bgc: '#dee8ff'
    }
])
</script>

<style lang="scss" scoped>
.fastEntry {
    height: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;

    .fastEntry-header {
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

    .fastEntry-list {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;

        .fastEntry-item {
            display: flex;
            align-items: center;
            width: 230px;
            margin-bottom: 34px;

            &:hover {
                color: #3370FF;
                cursor: pointer;
            }

            .image {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 56px;
                height: 56px;
                background: #dee8ff;
                margin-right: 10px;
                border-radius: 8px;
            }

        }

        .deptPath {
            font-size: 14px;
        }
    }
}
</style>
