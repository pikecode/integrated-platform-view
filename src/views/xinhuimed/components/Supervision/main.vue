<template>
    <header>
        <img :src='imgUrl' @click="changeShowModel($event)"/>
        <div class="btns">
            <el-button color="#3370FF" type="primary" plain>新建</el-button>
            <el-button color="#3370FF" type="primary" plain>编辑</el-button>
            <el-button color="#3370FF" type="primary" plain>删除</el-button>
        </div>
    </header>
    <div v-if="activeModel === 'table'" class="supervision-list">
        <div  :class="{'list-item': true, 'checked': item.checked }" v-for="item in list" :key="item.id"
             v-show="activeModel === 'table'">
            <el-checkbox v-model="item.checked" size="large"/>
            <div class="main">
                <p class="title">{{ item.title }}</p>
                <div class="other">
                    <div class="status">
                        <span class="label">任务进展 </span>
                        <span v-for="(tag, index) in tags"
                              :key="tag.label + index">
                            <el-tag
                                v-if="item.status === tag.label"
                                :type="tag.type"
                                effect="plain"
                            >
                                {{ tag.label }}</el-tag>
                        </span>
                    </div>
                    <div class="degree">
                        <span class="label">紧急程度 </span>
                        {{ item.degree }}
                    </div>
                    <div class="responsible">
                        <span class="label">责任人 </span>
                        {{ item.responsible }}
                    </div>
                    <div class="implement">
                        <span class="label">执行人 </span>
                        {{ item.implement }}
                    </div>
                    <div class="progress">
                        <span class="label">进度 </span>
                        <el-progress :percentage="item.progress"/>
                    </div>
                    <div class="create_at">
                        <span class="label">创建时间 </span>
                        {{ item.create_at }}
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div v-else class="grid-list">
        <div :class="{'grid-item': true, 'checked': item.checked }" v-for="item in list" :key="item.id">
            <div class="title">
                <p>{{item.title}}</p>
                <el-checkbox v-model="item.checked" size="large"/>
            </div>
            <div class="other">
                <div class="status">
                    <span class="label">任务进展 </span>
                    <span v-for="(tag, index) in tags"
                          :key="tag.label + index">
                            <el-tag
                                v-if="item.status === tag.label"
                                :type="tag.type"
                                effect="plain"
                            >
                                {{ tag.label }}</el-tag>
                        </span>
                </div>
                <div class="degree">
                    <span class="label">紧急程度 </span>
                    {{ item.degree }}
                </div>
                <div class="responsible">
                    <span class="label">责任人 </span>
                    {{ item.responsible }}
                </div>
                <div class="implement">
                    <span class="label">执行人 </span>
                    {{ item.implement }}
                </div>
                <div class="progress">
                    <span class="label">进度 </span>
                    <el-progress :percentage="item.progress"/>
                </div>
                <div class="create_at">
                    <span class="label">创建时间 </span>
                    {{ item.create_at }}
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    list: Array
})

const activeModel = ref('table')

const imgUrl = ref('/img/dept/grid.png')

const changeShowModel = (e) => {
    if (e.target.src.includes('grid')) {
        imgUrl.value = '/img/dept/table.png'
        activeModel.value = 'grid'
    } else {
        imgUrl.value = '/img/dept/grid.png'
        activeModel.value = 'table'
    }
}

const tags = ref([
    { type: '', label: '审批中' },
    { type: 'success', label: '已完成' },
    { type: 'info', label: '已撤销' },
    { type: 'danger', label: '逾期进行中' },
    { type: 'warning', label: '进行中' },
])
</script>

<style lang="scss" scoped>
header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;

    img {
        cursor: pointer;
    }
}

.supervision-list {
    margin-top: 27px;

    .list-item {
        display: flex;
        height: 78px;
        margin-top: 20px;
        padding: 18px 20px 12px;
        box-sizing: border-box;
        cursor: pointer;

        .el-checkbox {
            height: 14px;
        }

        .main {
            width: 100%;
            margin-left: 10px;

            .title {
                margin-bottom: 12px;
                font-weight: bold;
            }

            .other {
                display: flex;
                align-items: center;
                font-size: 14px;

                .label {
                    color: #646A73;
                }

                div {
                    flex: 4;
                }

                .responsible, .degree {
                    flex: 3;
                }

                .progress {
                    display: flex;

                    .el-progress {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
}

.grid-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;

    .grid-item {
        width: 48.69%;
        height: 230px;
        margin-bottom: 20px;
        margin-right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        border: 1px solid #DDDDDD;
        box-sizing: border-box;

        &:nth-child(2n) {
            margin-right: 0;
        }

        .title {
            display: flex;
            justify-content: space-between;
            font-weight: bold;

            .el-checkbox {
                height: 14px;
            }
        }

        .other {
            margin-top: 16px;
            font-size: 14px;

            .label {
                color: #646A73;
            }

            div {
                margin-top: 14px;
            }

            .progress {
                display: flex;

                .el-progress {
                    width: 138px;
                    margin: 0 0 0 10px;
                }
            }
        }
    }
}

.checked {
    background: #F5F9FD;
    border-radius: 8px;
    border: 1px solid #3370FF !important;

    .title {
        color: #3370FF;
    }
}

.el-tag {
    background: none;
    border: none;
    font-size: 14px;
    font-weight: bold;
    color: #A45EEB;
}

.el-tag--warning {
    color: #FF8800;
}

.el-tag--success {
    color: #05D2D0;
}

.el-tag--info {
    color: #9DA6B2;
}

.el-tag--danger {
    color: #FF2E00;
}
</style>
