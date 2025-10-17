<template>
    <div class="card-box">
        <div class="card-header">
            <div class="card-header-type">
                <template v-if="route.path === '/xinhuimed/workbench/index'">
                    <p :class="{'card-header-type-active': activeMeetingType === 'arrange'}"
                       @click="handleMeetingType('arrange')">会议安排</p>
                    <p :class="{'card-header-type-active': activeMeetingType === 'topic'}"
                       @click="handleMeetingType('topic')">会议议题</p>
                </template>
                <p :class="{'card-header-type-active': activeMeetingType === 'supervision'}"
                   @click="handleMeetingType('supervision')">督办任务</p>
            </div>
            <el-button link>更多&nbsp;<span>&gt;</span></el-button>
        </div>
        <!--        会议安排  -->
        <MeetingArrangement v-model:list="meetingList" v-if="activeMeetingType === 'arrange'"/>
        <Supervision v-model:list="supervisionList" v-if="activeMeetingType === 'supervision'"/>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from 'vue-router'
import MeetingArrangement from "@/views/xinhuimed/components/MeetingArrangement/main.vue"
import Supervision from "@/views/xinhuimed/components/Supervision/main.vue"

const route = useRoute()
const activeMeetingType = route.path === '/xinhuimed/workbench/index' ? ref('arrange') : ref('supervision')
const handleMeetingType = (e) => {
    activeMeetingType.value = e
}

// 列表数据
const meetingList = ref([
    {
        title: '医疗质量管理工作专题会议',
        venue: '行政楼会议室2',
        start_at: '2023-09-08 17:00',
        user_name: '全体科室人员',
        end_at: '2023-09-08 17:00',
    },
    {
        title: '医院信息化工作领导小组专题会议',
        venue: '一号行政楼',
        start_at: '2023-09-08 17:00',
        user_name: '全体主任医师、副主任...',
        end_at: '2023-09-08 17:00',
    },
    {
        title: '关于组织开展2022年非卫生系列科室会议',
        venue: '行政楼会议室2',
        start_at: '2023-09-08 17:00',
        user_name: '部分人员',
        end_at: '2023-09-08 17:00',
    },
    {
        title: '关于组织开展2022年非卫生系列科室会议',
        venue: '一号行政楼',
        start_at: '2023-09-08 17:00',
        user_name: '全体科室人员',
        end_at: '2023-09-08 17:00',
    },
    {
        title: '关于组织开展2022年非卫生系列科室会议',
        venue: '一号行政楼',
        start_at: '2023-09-08 17:00',
        user_name: '全体主任医师、副主任...',
        end_at: '2023-09-08 17:00',
    }
])

const supervisionList = ref([
    {
        id: 1,
        title: '云上妇幼门诊记录取消时，如院内号源取消失败',
        status: '进行中',
        degree: '紧急',
        responsible: '王科长',
        implement: '林媛媛、李璐..',
        progress: 56,
        create_at: '2023-05-17',
        checked: false
    },{
        id: 2,
        title: '调整质控小组人员组成',
        status: '已完成',
        degree: '紧急',
        responsible: '王科长',
        implement: '林媛媛、李璐..',
        progress: 100,
        create_at: '2023-05-17',
        checked: false
    },
    {
        id: 3,
        title: '制定和修订质控科相关制度13项',
        status: '已撤销',
        degree: '紧急',
        responsible: '王科长',
        implement: '林媛媛、李璐..',
        progress: 0,
        create_at: '2023-05-17',
        checked: false
    },
    {
        id: 4,
        title: '组织人员在规定期间核酸',
        status: '审批中',
        degree: '重要',
        responsible: '王科长',
        implement: '林媛媛、李璐..',
        progress: 48,
        create_at: '2023-05-17',
        checked: false
    },
    {
        id: 5,
        title: '三级公立医院绩效考核',
        status: '逾期进行中',
        degree: '重要',
        responsible: '王科长',
        implement: '林媛媛、李璐..',
        progress: 48,
        create_at: '2023-05-17',
        checked: false
    }
])
</script>

<style lang="scss" scoped>
.card-box {
    height: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-header-type {
            display: flex;

            p {
                background: #E2EBFF;
                margin-right: 10px;
                padding: 12px 8px;
                border-radius: 3px;
                color: #3370FF;
                cursor: pointer;
            }

            .card-header-type-active {
                background-color: #3370FF;
                font-weight: bold;
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
