<template>
    <div class="container">
        <div class="container-header">
            <div>
                <p :class="{'header-type-active': activeHeaderType === 'learn'}" @click="handleHeaderType('learn')">
                    学习计划</p>
                <p :class="{'header-type-active': activeHeaderType === 'personalGrowth'}"
                   @click="handleHeaderType('personalGrowth')">个人成长</p>
                <p :class="{'header-type-active': activeHeaderType === 'document'}"
                   @click="handleHeaderType('document')">我的文档</p>
                <p :class="{'header-type-active': activeHeaderType === 'weeklyReport'}"
                   @click="handleHeaderType('weeklyReport')">我的周报</p>
            </div>
            <el-button link>更多&nbsp;<span>&gt;</span></el-button>
        </div>
        <LearningPlan v-model:list="learnList"/>
    </div>
</template>

<script setup>
import { ref } from "vue";
import LearningPlan from "@/views/xinhuimed/workbench/components/LearningPlan.vue";

const activeHeaderType = ref("learn")
const handleHeaderType = (e) => {
    activeHeaderType.value = e
}

const learnList = ref([
    {
        timer: '2023-08-18',
        title: '18项核心制度学校课程'
    },
    {
        timer: '2023-08-18',
        title: '医院制度和规程的管理规定学习课程'
    },
    {
        timer: '2023-08-18',
        title: '岗位职责制定规范学习课程'
    },
    {
        timer: '2023-08-18',
        title: '医德医风建设2023年8月月度学习课程'
    },
    {
        timer: '2023-08-18',
        title: '医德医风建设2023年7月月度学习课程'
    },
    {
        timer: '2023-08-18',
        title: '医德医风建设2023年6月月度学习课程x'
    }
])
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;

    .container-header {
        display: flex;
        justify-content: space-between;

        div {
            display: flex;

            p {
                padding: 12px 8px;
                background-color: #E2EBFF;
                border-radius: 3px;
                color: #3370FF;
                cursor: pointer;
                margin-right: 5px;
            }

            .header-type-active {
                background-color: #3370FF;
                color: #fff;
            }
        }

        .el-button.is-link {
            font-size: 16px;
            color: #3370FF;

            span {
                transform: translate(0, -2px)
            }
        }
    }
}
</style>
