<template>
    <div class="shopCalendar">
        <div class="shopCalendar-header">
            <p>工作日历</p>
            <el-button link>更多&nbsp;<span>&gt;</span></el-button>
        </div>
        <div class="time-select">
            <div class="today">
                <div class="what-day">{{ whatDay }}</div>
                <div class="what-week">{{ whatWeek }}</div>
            </div>
            <el-date-picker
                v-model="date"
                type="date"
                value-format="YYYY-MM-DD"
                @change="handleDateChange"
                :clearable="false"
            />
            <img src="/img/workbench/shopCalendar/edit.png">
            <div :class="{'back-today': true, 'back-today-disabled': today === date}" @click="handleToday">
                今天
                <img src="/img/workbench/shopCalendar/back.png">
            </div>
        </div>
        <div class="calendar">
            <el-calendar v-model="calendar" :range="[weekStart, weekEnd]"/>
        </div>
        <el-timeline>
            <el-timeline-item
                v-for="(item, index) in activities"
                :key="index"
                :class="{'checked': item.checked}"
            >
                <div class="timestamp">
                    {{ item.timestamp }}
                </div>
                <div class="context">
                    <el-input v-model="item.content"></el-input>
                    <el-checkbox v-model="item.checked" size="large"/>
                </div>
            </el-timeline-item>
        </el-timeline>

        <div class="event">
            <div class="event-header">
                <el-tabs v-model="activeTabs" class="demo-tabs" @tab-change="getStartAndEndTime('tabs')">
                    <el-tab-pane label="日" name="day"></el-tab-pane>
                    <el-tab-pane label="周" name="week"></el-tab-pane>
                    <el-tab-pane label="月" name="month"></el-tab-pane>
                </el-tabs>
                <el-button plain @click="getStartAndEndTime('sub')" v-show="activeTabs !== 'day'">
                    上一{{ activeTabs === 'day' ? '天' : activeTabs === 'week' ? '周' : '月' }}
                </el-button>
                <el-button plain @click="getStartAndEndTime('next')" v-show="activeTabs !== 'day'">
                    下一{{ activeTabs === 'day' ? '天' : activeTabs === 'week' ? '周' : '月' }}
                </el-button>
                <p class="timeFrame">
                    {{ startTime }} 至 {{ endTime }}
                </p>
            </div>
        </div>

        <div class="tables">
            <div class="tables-header">
                <div>
                    <p :class="{'tables-header-active': activeTablesType === 'nofinish'}"
                       @click="handleTablesType('nofinish')">未完成(3)</p>
                    <p :class="{'tables-header-active': activeTablesType === 'finish'}"
                       @click="handleTablesType('finish')">
                        已完成(3)</p>
                </div>
                <div>
                    <el-button type="primary">完成</el-button>
                    <el-button type="primary" plain>删除</el-button>
                </div>
            </div>
            <el-table :data="tableList.slice((page - 1) * 3, 3 * page )" style="width: 100%"
                      :header-cell-style="{'background': '#D9E8FF', 'text-align':'center'}">
                <el-table-column prop="date" label="时间" width="110"/>
                <el-table-column prop="name" label="任务" width="184"/>
                <el-table-column prop="address" label="操作">
                    <template #default="scope">
                        <el-button type="primary" link>完成</el-button>
                        <el-button type="primary" link>推迟</el-button>
                        <el-button type="danger" link>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="page" :page-size="3" layout="prev, pager, next" :total="total"/>
        </div>

    </div>
</template>

<script setup>
import dayjs from "dayjs";
import localeData from "dayjs/locale/zh-cn";
import { ref, watch } from "vue";
// dayjs 使用中文
dayjs.locale(localeData)

// 获取今天的日期
const today = ref(dayjs().format('YYYY-MM-DD'))
const date = ref(today.value)

// 日历
const calendar = ref(new Date())
let weekStart = ref(dayjs(today.value).startOf('week').toDate())
let weekEnd = ref(dayjs(today.value).endOf('week').toDate())

// 获取今天几号 / 周几
const whatDay = ref(dayjs().format('D'))
const whatWeek = ref(dayjs().format('dddd'))

// 日期切换时
const handleDateChange = (e) => {
    whatDay.value = dayjs(e).format('D')
    whatWeek.value = dayjs(e).format('dddd')
    weekStart.value = dayjs(e).startOf('week');
    weekEnd.value = dayjs(e).endOf('week');
    calendar.value = dayjs(e)
}

// 日历切换时
watch(calendar, (newValue, oldValue) => {
    date.value = dayjs(newValue).format("YYYY-MM-DD")
    whatDay.value = dayjs(newValue).format('D')
    whatWeek.value = dayjs(newValue).format('dddd')
});


// 点击今天
const handleToday = () => {
    date.value = today.value
    whatDay.value = dayjs(today.value).format('D')
    whatWeek.value = dayjs(today.value).format('dddd')
    calendar.value = dayjs(today.value)
}

// 时间线数据
const activities = ref([
    {
        content: '去2楼住院部411房间和王某某病人确认...',
        timestamp: '09:30:16',
        checked: false
    },
    {
        content: '去参加科室会议',
        timestamp: '14:30:20',
        checked: false
    },
    {
        content: '给主任递交手术资料',
        timestamp: '15:30:11',
        checked: false
    },
    {
        content: '填写周报',
        timestamp: '16:30:32',
        checked: false
    },
])

// 表格tab
const activeTabs = ref('day')

// 获取当天 本周 / 本月 时间范围
let thisDay = ref(dayjs().format('YYYY-MM-DD'))
let thisWeek = ref(dayjs().week())
let thisMonth = ref(dayjs().month())
let thisYear = ref(dayjs().year())
let startTime = ref('')
let endTime = ref('')
const getStartAndEndTime = (type) => {
    startTime.value = dayjs().startOf(activeTabs.value).format("YYYY-MM-DD")
    endTime.value = dayjs().endOf(activeTabs.value).format("YYYY-MM-DD")
    if (type === 'tabs') {
        thisDay.value = activeTabs.value === 'day' ? dayjs().format('YYYY-MM-DD') : thisDay.value
        thisWeek.value = activeTabs.value === 'week' ? dayjs().week() : thisWeek.value
        thisMonth.value = activeTabs.value === 'month' ? dayjs().month() : thisMonth.value
    }
    if (type === 'sub') {
        endTime.value = startTime.value = thisDay.value = activeTabs.value === 'day' ? dayjs(thisDay.value).subtract(1, 'day').format("YYYY-MM-DD") : thisDay.value

        thisWeek.value = activeTabs.value === 'week' ? thisWeek.value - 1 : thisWeek.value
        startTime.value = activeTabs.value === 'week' ? dayjs().year(thisYear.value).week(thisWeek.value).startOf('week').format("YYYY-MM-DD") : startTime.value
        endTime.value = activeTabs.value === 'week' ? dayjs().year(thisYear.value).week(thisWeek.value).endOf('week').format("YYYY-MM-DD") : endTime.value

        thisMonth.value = activeTabs.value === 'month' ? thisMonth.value - 1 : thisMonth.value
        startTime.value = activeTabs.value === 'month' ? dayjs().year(thisYear.value).month(thisMonth.value).startOf('month').format("YYYY-MM-DD") : startTime.value
        endTime.value = activeTabs.value === 'month' ? dayjs().year(thisYear.value).month(thisMonth.value).endOf('month').format("YYYY-MM-DD") : endTime.value
    }
    if (type === 'next') {
        endTime.value = startTime.value = thisDay.value = activeTabs.value === 'day' ? dayjs(thisDay.value).add(1, 'day').format("YYYY-MM-DD") : thisDay.value

        thisWeek.value = activeTabs.value === 'week' ? thisWeek.value + 1 : thisWeek.value
        startTime.value = activeTabs.value === 'week' ? dayjs().year(thisYear.value).week(thisWeek.value).startOf('week').format("YYYY-MM-DD") : startTime.value
        endTime.value = activeTabs.value === 'week' ? dayjs().year(thisYear.value).week(thisWeek.value).endOf('week').format("YYYY-MM-DD") : endTime.value

        thisMonth.value = activeTabs.value === 'month' ? thisMonth.value + 1 : thisMonth.value
        startTime.value = activeTabs.value === 'month' ? dayjs().year(thisYear.value).month(thisMonth.value).startOf('month').format("YYYY-MM-DD") : startTime.value
        endTime.value = activeTabs.value === 'month' ? dayjs().year(thisYear.value).month(thisMonth.value).endOf('month').format("YYYY-MM-DD") : endTime.value
    }

}
getStartAndEndTime()

// 表格
const activeTablesType = ref('nofinish')
const handleTablesType = (e) => {
    activeTablesType.value = e
}
const page = ref(1)
const total = ref(9)
const tableList = ref([
    {
        date: '09-10 09:30',
        name: '去2楼住院部411房间和王某...',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '09-10 09:30',
        name: '给主任递交手术资料',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '09-10 09:30',
        name: '填写周报',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '09-10 09:30',
        name: '给主任递交手术资料',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '09-10 09:30',
        name: '去2楼住院部411房间和王某...',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '09-10 09:30',
        name: '填写周报',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '09-10 09:30',
        name: '填写周报',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '09-10 09:30',
        name: '给主任递交手术资料',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '09-10 09:30',
        name: '去2楼住院部411房间和王某...',
        address: 'No. 189, Grove St, Los Angeles',
    },
])
// 切换分页
const handleCurrentChange = (e) => {
    console.log(e)
    page.value = e
}
</script>

<style lang="scss" scoped>
.shopCalendar {
    height: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;

    .shopCalendar-header {
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

    .time-select {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;

        .today {
            width: 56px;
            height: 56px;
            background: #3370FF;
            margin-right: 6px;
            border-radius: 8px;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            div {
                font-size: 20px;
            }

            .what-week {
                margin-top: 5px;
                font-size: 14px;
            }
        }


        img {
            margin-left: 17px;
            margin-right: 10px;
        }

        .back-today {
            padding: 9px 7px;
            background-color: #3370FF;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;

            img {
                margin-left: 2px;
            }
        }

        .back-today-disabled {
            background-color: #99C2FF;
            cursor: not-allowed;
        }
    }

    .calendar {
        margin: 12px 0 20px;
        box-sizing: border-box;

        :deep(.el-calendar__header) {
            display: none;
        }

        :deep(.el-calendar__body) {
            padding: 0;

            thead {
                height: 30px;
                background-color: #F5F9FD;
            }

            tbody {
                td {
                    border-style: solid;
                    width: 48px;
                    height: 48px;
                    border: none;
                    border-radius: 8px;
                    text-align: center;
                    color: #9DA6B2;

                    .el-calendar-day {
                        width: 48px;
                        height: 48px;
                        margin-top: 12px;
                        line-height: 1.8;

                        &:hover {
                            background-color: #fff;
                            color: #3370FF;
                        }
                    }
                }

                .is-selected {
                    background-color: #fff;
                    color: #fff;

                    .el-calendar-day {
                        background-color: #3370FF;
                        border-radius: 8px;
                    }

                    .el-calendar-day:hover {
                        background-color: #3370FF;
                        border-radius: 8px;
                        color: #fff;
                    }
                }
            }
        }
    }

    .el-timeline {
        height: 252px;
        padding: 15px 10px 0 0;
        overflow-y: scroll;

        .el-timeline-item {
            &:last-child {
                padding-bottom: 0;
            }

            padding-left: 75px;

            :deep(.el-timeline-item__tail) {
                left: 80px;
            }

            :deep(.el-timeline-item__node--normal) {
                display: block;
                left: 75px;

                &::before {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    content: "";
                    display: block;
                    width: 16px;
                    height: 16px;
                    border-radius: 50% 50%;
                    border: 1px solid #DDDDDD;
                    transform: translate(-50%, -50%);
                }
            }

            .timestamp {
                position: absolute;
                top: 2px;
                left: -70px;
                font-weight: bold;
                color: #646A73;
            }

            .context {
                display: flex;
                transform: translate(0, -10px);

                .el-checkbox {
                    margin-left: 11px;
                }
            }
        }

        .checked {
            :deep(.el-timeline-item__node--normal) {
                background-color: #3370FF;

                &::before {
                    border: 1px solid #2366FD;
                }
            }

            .timestamp {
                color: #3370FF;
            }

            :deep(.el-input__inner) {
                color: #3370FF;
                font-weight: bold;
            }

            .context {
                .el-input {
                    --el-input-border-color: #3370FF;
                }

                :deep(.el-input__wrapper) {
                    background-color: #F5F9FD;
                }
            }
        }
    }

    .event {
        .event-header {
            display: flex;
            align-items: center;

            .el-tabs {
                --el-tabs-header-height: 28px;
            }

            :deep(.el-tabs__header) {
                margin-bottom: 5px;
            }

            .el-button {
                padding: 2px 5px;
                font-size: 12px;
            }

            .timeFrame {
                flex: 1;
                text-align: end;
                font-size: 14px;
                color: #646A73;
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

        :deep(.el-tabs__item) {
            padding: 0 10px;
            color: #646A73;
        }

        :deep(.el-tabs__item.is-active) {
            color: var(--el-color-primary);
        }
    }

    .tables {
        margin-top: 12px;

        .tables-header {
            display: flex;
            justify-content: space-between;
            align-items: end;

            div {
                display: flex;

                p {
                    padding: 12px 8px;
                    background-color: #E2EBFF;
                    border-radius: 3px;
                    font-weight: bold;
                    color: #3370FF;
                    cursor: pointer;
                    margin-right: 10px;
                }

                .tables-header-active {
                    background-color: #3370FF;
                    color: #fff;
                }
            }

            .el-button {
                padding: 8px 14px;
            }
        }

        .el-table {
            margin-top: 20px;

            :deep(thead) {
                color: #646A73;
            }

            :deep(.cell) {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .el-button + .el-button {
                margin: 0;
            }

            :deep(.el-table_1_column_1) {
                color: #646A73;
            }
        }

        :deep(.el-pagination) {
            margin-top: 5px;
            float: right;
        }
    }
}
</style>
