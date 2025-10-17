<template>
    <div class="card-middle">
        <el-tabs v-model="activeScreen" class="demo-tabs" @tab-click="handleTabChange">
            <el-tab-pane label="待参会议" name="toBeAttended"></el-tab-pane>
            <el-tab-pane label="本周会议" name="weeksMeeting"></el-tab-pane>
            <el-tab-pane label="已开会议" name="finish"></el-tab-pane>
            <el-tab-pane label="我的会议纪要" name="my"></el-tab-pane>
        </el-tabs>
        <div class="card-header-type">
            <p :class="{'card-header-type-active': activeType === 'record'}" @click="changeActiveType('record')">会中记录</p>
            <p :class="{'card-header-type-active': activeType === 'delay'}" @click="changeActiveType('delay')">延迟会议</p>
        </div>
    </div>
    <div class="card-body">
        <div class="list-item" v-for="(item, index) in list" :key="index">
            <p class="list-item-title">
                <el-checkbox v-model="item.check" size="large"/>&nbsp;&nbsp;{{ item.title }}
            </p>
            <div class="list-item-main">
                <p>
                    开始时间&nbsp;
                    <span class="list-item-main-value">{{ item.start_at }}</span>
                </p>

                <p>
                    结束时间&nbsp;
                    <span class="list-item-main-value">{{ item.end_at }}</span>
                </p>
                <p>
                    召开地点&nbsp;
                    <span class="list-item-main-value">{{ item.venue }}</span>
                </p>
                <p>
                    参会人员&nbsp;
                    <span class="list-item-main-value">{{ item.user_name }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
let props = defineProps({
    list: Array
})

let $emit = defineEmits(['update:list'])

watch( props.list, (newVal) => {
    $emit('update:list', newVal)
})

// 点击tabs
const activeScreen = ref('toBeAttended')
const handleTabChange = () => {
}
const activeType = ref('record')
const changeActiveType = (type) => {
    activeType.value = type
}
// 列表数据
</script>

<style lang="scss" scoped>
.card-header, .card-middle {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-tabs {
        height: 30px;
        transform: translate(0, -10px);
    }

    .card-header-type {
        display: flex;

        p {
            background: #E2EBFF;
            margin-right: 10px;
            padding: 8px 14px;
            border: 1px solid #3370FF;
            border-radius: 3px;
            color: #3370FF;
            cursor: pointer;
        }

        .card-header-type-active {
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

.card-middle {
    margin-top: 20px;

    p {
        font-size: 14px;
    }
}

.card-body {
    overflow: hidden;

    p {
        color: #000;
    }

    .list-item {
        height: 80px;
        margin-top: 26px;
        padding: 17px 20px;
        box-sizing: border-box;
        cursor: pointer;

        &:first-child {
            margin-top: 20px;
        }

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

            .el-checkbox {
                height: 100%;
            }
        }

        .list-item-main {
            display: flex;
            justify-content: space-between;
            margin: 16px 0 0 24px;
            font-size: 14px;

            p {
                flex: 6;
                color: #646A73;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;

                &:last-child {
                    flex: 7;
                }
            }

            .list-item-main-value {
                color: #000;
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

:deep(.el-tabs__item) {
    padding: 0 10px;
    color: #646A73;
}

:deep(.el-tabs__item.is-active) {
    color: var(--el-color-primary);
}
</style>
