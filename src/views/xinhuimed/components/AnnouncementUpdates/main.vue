<template>
    <div class="container">
        <div class="container-header">
            <div>
                <p :class="{'header-type-active': activeHeaderType === 'notice'}"
                   @click="handleHeaderType('notice')">通知公告</p>
                <p :class="{'header-type-active': activeHeaderType === 'latestUpdates'}"
                   @click="handleHeaderType('latestUpdates')">最新动态</p>
                <p :class="{'header-type-active': activeHeaderType === 'deptUpdates'}"
                   @click="handleHeaderType('deptUpdates')">科室动态</p>
            </div>
            <el-button link>更多&nbsp;<span>&gt;</span></el-button>
        </div>
        <NoticeAnnouncement v-if="activeHeaderType === 'notice'" v-model:list="noticeList"/>
        <DeptUpdates v-if="activeHeaderType === 'deptUpdates'" v-model:list="deptList"/>
    </div>
</template>

<script setup>
import { ref } from "vue";
import NoticeAnnouncement from "@/views/xinhuimed/components/NoticeAnnouncement/main.vue"
import DeptUpdates from "@/views/xinhuimed/components/DeptUpdates/main.vue"

const activeHeaderType = ref("notice")
const handleHeaderType = (e) => {
    activeHeaderType.value = e
}

const noticeList = ref([
    {
        title: '【通知】2022年度浙江大学医学院附属妇产科',
        timer: '2023-08-18'
    },
    {
        title: '【通知】浙江大学医学院附属妇产科医院',
        timer: '2023-08-18'
    },
    {
        title: '【通知】2022年度浙大附属妇产科医院公文',
        timer: '2023-08-18'
    },
    {
        title: '【通知】浙大妇产科医院钱江院区二期工作',
        timer: '2023-08-18'
    },
    {
        title: '【通知】2023年浙大妇院预算公开说明',
        timer: '2023-08-18'
    }, {
        title: '【通知】2022年度浙江大学医学院附属妇产科',
        timer: '2023-08-18'
    },
    {
        title: '【通知】浙江大学医学院附属妇产科医院',
        timer: '2023-08-18'
    },
    {
        title: '【通知】2022年度浙大附属妇产科医院公文',
        timer: '2023-08-18'
    },
])
const deptList = ref([
    {
        id: 1,
        title: '质管科党支部、感染科党支部联合开展主题党...',
        content: '为深入学习贯彻党的二十大精神，以党建促进…',
        create_at: '2023-09',
        create_at_day: '06'
    },
    {
        id: 2,
        title: '中国出生缺陷干预救助基金会科学技术奖颁奖...',
        content: '2023年9月12日，中国出生缺陷干预救助基金...',
        create_at: '2023-09',
        create_at_day: '05'
    },
    {
        id: 3,
        title: '人事变动通知',
        content: '内部文件202305号关于人事变动的通知超声科…',
        create_at: '2023-09',
        create_at_day: '04'
    },
    {
        id: 4,
        title: '实践感悟新时代 挺膺担当新征程 ——浙江大...',
        content: '6月27日，浙江大学医学院附属妇产科医院庆…',
        create_at: '2023-09',
        create_at_day: '03'
    },
    {
        id: 5,
        title: '质管科党支部、感染科党支部联合开展主题党...',
        content: '为深入学习贯彻党的二十大精神，以党建促进…',
        create_at: '2023-09',
        create_at_day: '02'
    },
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
