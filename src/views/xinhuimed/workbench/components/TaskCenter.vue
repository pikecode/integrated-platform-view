<template>
    <div class="task-box">
        <div class="task-header">
            <div class="user-info">
                <div class="avatar">
                    <img src="/img/workbench/avatar.png">
                </div>
                <div class="say">
                    <p class="user-name">{{helloMsg }}{{ username}}, 祝您开心！</p>
                    <p class="org-role">总务部，科长</p>
                </div>
            </div>
            <div class="task">
                <div :class="{'task-item': true, 'active': activeTask.code === item.code}" v-for="item in taskTabs"
                     :key="item.code" @click="activeTaskItem(item)">
                    <div class="image">
                        <img :src="item.icon">
                    </div>
                    <div class="task-count">
                        <p class="count">{{ item.count }}</p>
                        <p>{{ item.label }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="card-body-header">
                <div class="task-search">
                    <p class="task-name">{{ activeTask.label }}</p>
                    <el-tabs v-model="activeScreen" class="demo-tabs" @tab-click="handleTaskScreen">
                        <el-tab-pane label="周" name="week"></el-tab-pane>
                        <el-tab-pane label="月" name="month"></el-tab-pane>
                        <el-tab-pane label="年" name="year"></el-tab-pane>
                        <el-tab-pane label="优先级高" name="fourth"></el-tab-pane>
                    </el-tabs>
                </div>
                <el-button link @click="showMore">更多&nbsp;<span>&gt;</span></el-button>
            </div>
            <div class="card-body-list">
                <div class="list-item" v-for="(item, index) in taskList" :key="index">
                    <p class="list-item-title">{{ item.title }}<span v-if="item.status === 2">超时</span></p>
                    <div class="list-item-main">
                        <p v-show="['wait', 'finish'].includes(activeTask.code)">
                            任务来源&nbsp;
                            <span class="list-item-main-value">{{ item.source }}</span>
                        </p>
                        <p>
                            {{ ['wait', 'finish'].includes(activeTask.code) ? '创建': '发起' }}时间&nbsp;
                            <span class="list-item-main-value">{{ item.create_at }}</span>
                        </p>
                        <p>
                            {{  ['wait', 'finish'].includes(activeTask.code) ? '创建': '发起' }}人&nbsp;
                            <span class="list-item-main-value">{{ item.create_name }}</span>
                        </p>
                        <p v-show="['wait', 'finish'].includes(activeTask.code)">
                            截止时间&nbsp;
                            <span class="list-item-main-value">{{ item.end_at }}</span>
                        </p>
                        <p v-show="['wait', 'finish'].includes(activeTask.code)">
                            优先级&nbsp;
                            <span class="list-item-main-value high" v-if="item.priority === '高'">{{
                                    item.priority
                                }}</span>
                            <span class="list-item-main-value middle" v-if="item.priority === '中'">{{
                                    item.priority
                                }}</span>
                            <span class="list-item-main-value low" v-if="item.priority === '低'">{{
                                    item.priority
                                }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRef } from "vue";
import { useStore } from "vuex";

const { getters } = useStore()

// 获取用户名
const username = getters.userInfo.real_name
// 获取当前时间
const getTimeState = () => {
    // 获取当前时间
    let timeNow = new Date();
    // 获取当前小时
    let hours = timeNow.getHours();
    // 设置默认文字
    let state = ``;
    // 判断当前时间段
    if (hours >= 0 && hours <= 10) {
        state = `早安!`;
    } else if (hours > 10 && hours <= 11) {
        state = `上午好!`;
    } else if (hours > 11 && hours <= 13) {
        state = `中午好!`;
    } else if (hours > 13 && hours <= 18) {
        state = `下午好!`;
    } else if (hours > 18 && hours <= 24) {
        state = `晚上好!`;
    }
    return state;
}
const helloMsg = ref(getTimeState())

// 任务选项
const taskTabs = ref([
    {
        label: '我的待办',
        code: 'wait',
        count: 56,
        icon: '/img/workbench/wait.png'
    },
    {
        label: '已办任务',
        code: 'finish',
        count: 48,
        icon: '/img/workbench/finish.png'
    },
    {
        label: '我发起的流程',
        code: 'launch',
        count: 23,
        icon: '/img/workbench/launch.png'
    },
    {
        label: '待我审批的流程',
        code: 'waitApf',
        count: 123,
        icon: '/img/workbench/waitApf.png'
    },
])

// 点击选中任务
let activeTask = toRef({
    label: '我的待办',
    code: 'wait',
})
const activeTaskItem = (item) => {
    activeTask.value = { ...item }
}

const activeScreen = ref('week')
// 年 月 周 优先级筛选
const handleTaskScreen = () => {
    console.log(this.activeScreen)
}
// 列表数据
const taskList = ref([
    {
        title: '科室质检管理检查跟进',
        source: '2023年7月院长办公会议',
        create_at: '2023-05-10',
        create_name: '王海燕',
        end_at: '2023-05-17',
        priority: '高',
        status: 2
    },
    {
        title: '备战等级医院评审建设',
        source: '2023年7月院长办公会议',
        create_at: '2023-05-10',
        create_name: '李铭惠',
        end_at: '2023-05-17',
        priority: '高'
    },
    {
        title: '通过DRGs平台反馈数据对医院绩效进行深度评价',
        source: '2023年7月院长办公会议',
        create_at: '2023-05-10',
        create_name: '张秋叶',
        end_at: '2023-05-17',
        priority: '中'
    },
    {
        title: '等级评审二类指标中年出院人次、DRG组数',
        source: '2023年7月院长办公会议',
        create_at: '2023-05-10',
        create_name: '薛长江',
        end_at: '2023-05-17',
        priority: '低'
    },
    {
        title: '备战等级医院评审建设',
        source: '2023年7月院长办公会议',
        create_at: '2023-05-10',
        create_name: '李铭惠',
        end_at: '2023-05-17',
        priority: '高'
    },
    {
        title: '通过DRGs平台反馈数据对医院绩效进行深度评价',
        source: '2023年7月院长办公会议',
        create_at: '2023-05-10',
        create_name: '张秋叶',
        end_at: '2023-05-17',
        priority: '中'
    },
])

// 点击更多
const showMore = () => {
  window.open('http://rwdb.v1.xinhuimed.net/v3/#/taskSupervision/leaderView/detail', '_blank',)
}
</script>

<style lang="scss" scoped>
.task-box {
    height: 100%;
    background-color: #fff;
    overflow: hidden;

    p {
        margin: 0;
        color: #fff;
    }

    img {
        width: 100%;
        height: 100%;
    }

    :deep(.task-header) {
        position: relative;
        display: flex;
        align-items: center;
        height: 144px;
        background: url("/img/workbench/bg.png") no-repeat 0 0;
        background-size: 100% 100%;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0px 8px 8px 0px rgba(0,0,0,0.06);

        .user-info {
            display: flex;
            align-items: center;
            width: 416px;
            padding: 20px;
            box-sizing: border-box;

            .avatar {
                width: 104px;
                height: 104px;
                border-radius: 50% 50%;
                overflow: hidden;
            }

            .say {
                margin-left: 20px;

                .user-name {
                    font-size: 20px;
                }

                .org-role {
                    margin-top: 10px;
                    font-size: 16px;
                }
            }
        }

        .task {
            flex: 1;
            display: flex;
            justify-content: space-between;
            height: 100%;
            padding-right: 20px;

            .task-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                width: 100%;
                height: 100%;
                padding: 10px 0;
                box-sizing: border-box;
                cursor: pointer;

                .image {
                    width: 60px;
                    height: 60px;
                    background-color: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 75px;

                    img {
                        width: 29px;
                        height: 28px;
                    }
                }

                .task-count {
                    p {
                        text-align: center;
                    }

                    .count {
                        margin-bottom: 5px;
                        font-size: 24px;
                    }
                }
            }

            .active {
                position: relative;
                background-color: #3370FF;

                &::before {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    width: 0;
                    height: 0;
                    transform: translateX(-50%);
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-top: 10px solid #3370FF; /* 伪元素的底部颜色 */
                }
            }
        }

        .waves {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }

    .card-body {
        padding: 20px;
        background-color: #fff;
        border-radius: 0 0 5px 10px;

        .card-body-header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .task-search {
                display: flex;
                align-items: center;

                .task-name {
                    margin-right: 80px;
                    padding: 12px 8px;
                    background-color: #3370FF;
                    border-radius: 3px;
                    font-weight: bold;
                }

                :deep(.el-tabs__header) {
                    margin: 0;
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

        .card-body-list {
            height: 500px;
            overflow: hidden;

            p {
                color: #000;
            }

            .list-item {
                height: 80px;
                margin-top: 20px;
                padding: 17px 20px;
                box-sizing: border-box;
                cursor: pointer;

                &:hover {
                    background: #F5F9FD;
                    border-radius: 8px;
                    border: 1px solid #3370FF;

                    .list-item-title {
                        color: #3370FF;
                    }
                }

                .list-item-title {
                    display: flex;
                    align-items: center;
                    font-weight: bold;

                    &::before {
                        content: '';
                        display: block;
                        width: 5px;
                        height: 5px;
                        background: #3370FF;
                        margin-right: 8px;
                        border-radius: 50%;
                    }

                    span {
                        width: 32px;
                        height: 16px;
                        background: #FF2E00;
                        margin-left: 12px;
                        text-align: center;
                        line-height: 16px;
                        border-radius: 4px 4px 4px 4px;
                        border: 1px solid #FF2E00;
                        font-size: 12px;
                        color: #fff;
                    }
                }

                .list-item-main {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                    font-size: 14px;

                    p {
                        color: #646A73;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }

                    .list-item-main-value {
                        color: #000;
                    }

                    .list-item-main-value.high {
                        color: #FF2E00;
                    }

                    .list-item-main-value.middle {
                        color: #FF8800;
                    }

                    .list-item-main-value.low {
                        color: #05D2D0;
                    }
                }
            }
        }
    }
}

:deep(.el-tabs__nav-wrap::after) {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
    background-color: #E4E7ED;
    z-index: 1;
}

:deep(.el-tabs__item){
    padding: 0 10px;
    color: #646A73;
}

:deep(.el-tabs__item.is-active) {
    color: var(--el-color-primary);
}
</style>
