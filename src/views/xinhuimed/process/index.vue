<template>
    <div class="container">
        <div class="often">
            <div class="flex-jcsb-aic">
              <p class="often-title">常用流程</p>
              <!-- <el-button type="primary" @click="$router.push('/plugin/workflow/pages/process/send')">我提交的审批</el-button> -->
            </div>
            <div class="often-list">
                <div class="often-item" v-for="(item, index) in oftenList" :key="index" @click="dynamicRoute(item, 'start')">
                    <div class="icon">
                        <el-icon color="#3370FF" size="24px">
                            <Document/>
                        </el-icon>
                    </div>
                    <div class="often-info">
                        <p class="title">{{ item.title }}</p>
                        <p class="cate">{{ item.dept }}</p>
                    </div>
                    <div class="often-close" @click.stop="clearOftenFlow(item, index)">x</div>
                </div>
                <div class="add-often" @click="handleAddOften">
                    <div class="icon">
                        <el-icon color="#9DA6B2" size="24px">
                            <CirclePlus/>
                        </el-icon>
                    </div>
                    <p>添加常用流程</p>
                </div>
            </div>
        </div>
        <div class="all-flow">
            <div class="all-flow-header">
                <p class="all-flow-header-title">全部流程</p>
                <div class="all-flow-search">
                    <p>流程名称</p>
                    <el-input
                        v-model="keyword"
                        size="large"
                        placeholder="请输入关键字"
                        :prefix-icon="Search"
                    />
                    <el-button type="primary" @click="getDeptList">查询</el-button>
                </div>
            </div>
            <div class="all-flow-main">
                <div class="all-flow-main-left">
                    <div class="dept-item" v-for="(item, index) in deptList" :key="index"
                         @mouseenter="hover = item.icon" @mouseleave="hover = ''" @click="scrollToDept(item)">
                        <img :src="getImg(item)">
                        <p>{{ item.title }}</p>
                    </div>
                </div>
                <div class="all-flow-main-right">
                    <div class="dept-item" v-for="(item, index) in deptList" :key="index">
                        <div class="item-header">
                            <div class="dept-info">
                                <div class="icon" :style="{backgroundColor: item.bac}">
                                    <img :src="getImg(item, 'dept')">
                                </div>
                                <p class="dept-title">{{ item.title }}</p>
                            </div>
                            <div class="show-flow" @click="item.showFlow = !item.showFlow" v-if="item.flows.length > 6">
                                {{ item.showFlow ? '收起' : '展开' }}&nbsp;
                                <el-icon size="16px">
                                    <ArrowUp v-show="item.showFlow"/>
                                    <ArrowDown v-show="!item.showFlow"/>
                                </el-icon>
                            </div>
                        </div>
                        <div class="flow-list">
                            <div class="list-item" v-for="(flow, flowIndex) in item.showFlow ? item.flows : item.flows.slice(0, 6)" :key="flowIndex" @click="dynamicRoute(flow, 'start')">
                                <el-icon size="20px">
                                    <Document color="#3370FF" v-if="flow.type === 1"/>
                                    <Share color="#3370FF" v-else/>
                                </el-icon>
                                <p v-html="flow.title"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            v-model="add0ftenVisible"
            title="Tips"
            width="900px"
        >
            <template #header>
                <p class="dialog-title">添加常用流程</p>
            </template>
            <div class="search">
                <p>流程名称</p>
                <el-input
                    v-model="keyword"
                    size="large"
                    placeholder="请输入关键字"
                />
                <el-button type="primary" @click="getDeptList">查询</el-button>
            </div>
            <div class="main">
                <div class="dept">
                    <div :class="{'dept-item': true, 'active-dept': activeDept === 'all'}" @click="activeDept = 'all'">
                        全部流程
                    </div>
                    <div :class="{'dept-item': true, 'active-dept': activeDept === item.title}"
                         v-for="(item, index) in list"
                         :key="'dept' + index"
                         @click="activeDept = item.title"
                    >
                        {{ item.title }}
                    </div>
                </div>
                <div class="flow">
                    <div class="flow-item" v-for="(item, index) in flowList.filter(flow => activeDept === 'all' ? true : flow.dept === activeDept)" :key="index">
                        <p>{{item.title}}</p>
                        <el-checkbox v-model="item.checked" size="large" />
                    </div>
                </div>
                <div class="active">
                    <div class="clear">
                        已选：{{flowList.filter(item => item.checked).length}}&nbsp;个
                        <el-button type="primary" link @click="clearActiveFlow">全部清除</el-button>
                    </div>
                    <div v-for="(item, index) in flowList" :key="index" >
                        <div class="active-item" v-if="item.checked">
                            <p>{{item.title}}</p>
                            <el-icon @click="item.checked = false"><CloseBold /></el-icon>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="add0ftenVisible = false">取消</el-button>
                <el-button type="primary" @click="onSaveAdd0ftenVisible">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Search } from '@element-plus/icons-vue'
import { processList as getList } from '@/views/plugin/workflow/api/process/process.js';
import Layout from "@/page/index/index.vue";

const router = useRouter()


const keyword = ref('')

// 移除单个常用流程
const clearOftenFlow = (item, index) => {
    oftenList.value.splice(index, 1)
    flowList.value.forEach(flow => {
        if(item.dept === flow.dept && item.title === flow.title) {
            flow.checked = false
        }
    })
}
// 常用流程列表
const oftenList = ref([])

const list = ref([
    {
        title: '演示表单',
        icon: 'partyGovernment',
        bac: '#FF2E00',
        showFlow: true,
        flows: [
            {
                title: '浙江大学医学院附属妇产科医院党委用印申请表',
                type: 1
            },
            {
                title: '个人医德医风年度考核流程',
                type: 2
            },
            {
                title: '浙江大学医学院附属妇产科医院教育基金会用印申请表',
                type: 1
            },
            {
                title: '医德医风社会医疗登记流程',
                type: 1
            },
            {
                title: '医院用印申请流程',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            },
            {
                title: '医院用印申请流程',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '党建工作办公室',
        icon: 'partyBuilding',
        bac: '#FF2E00',
        showFlow: true,
        flows: [
            {
                title: '浙江大学医学院附属妇产科医院党委用印申请表',
                type: 1
            },
            {
                title: '个人医德医风年度考核流程',
                type: 2
            },
            {
                title: '浙江大学医学院附属妇产科医院教育基金会用印申请表',
                type: 2
            },
            {
                title: '医德医风社会医疗登记流程',
                type: 1
            },
            {
                title: '医院用印申请流程',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '纪委办公室(监察审计室)',
        icon: 'disciplineInspectionCommission',
        bac: '#FF8800',
        showFlow: true,
        flows: [
            {
                title: '行玫值班呼叫来院交通补助申请流程',
                type: 2
            },
            {
                title: '员工奖励事由记录确认单',
                type: 2
            },
            {
                title: '麻醉记录单',
                type: 2
            },
            {
                title: '浙江大学医学院附属妇产科医院党委用印申请表',
                type: 2
            }
        ]
    },
    {
        title: '宣传部',
        icon: 'propaganda',
        bac: '#05D2D0',
        showFlow: true,
        flows: [
            {
                title: '行玫值班呼叫来院交通补助申请流程',
                type: 2
            },
            {
                title: '员工奖励事由记录确认单',
                type: 2
            },
            {
                title: '麻醉记录单',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '对外联络办公室',
        icon: 'externalLiaison',
        bac: '#A45EEB',
        showFlow: true,
        flows: [
            {
                title: '行玫值班呼叫来院交通补助申请流程',
                type: 2
            },
            {
                title: '员工奖励事由记录确认单',
                type: 2
            },
            {
                title: '麻醉记录单',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '医德医风管理类',
        icon: 'medicalEthics',
        bac: '#3370FF',
        showFlow: true,
        flows: [
            {
                title: '行玫值班呼叫来院交通补助申请流程',
                type: 2
            },
            {
                title: '员工奖励事由记录确认单',
                type: 2
            },
            {
                title: '麻醉记录单',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '其他',
        icon: 'medicalEthics',
        bac: '#3370FF',
        showFlow: true,
        flows: []
    }
])
const deptList = ref([
    {
        title: '演示表单',
        icon: 'partyGovernment',
        bac: '#FF2E00',
        showFlow: true,
        flows: [
            {
                title: '浙江大学医学院附属妇产科医院党委用印申请表',
                type: 1
            }, {
                title: '浙江大学医学院附属妇产科医院党委用印申请表',
                type: 1
            }, {
                title: '浙江大学医学院附属妇产科医院党委用印申请表',
                type: 1
            },
            {
                title: '个人医德医风年度考核流程',
                type: 2
            },
            {
                title: '浙江大学医学院附属妇产科医院教育基金会用印申请表',
                type: 1
            },
            {
                title: '医德医风社会医疗登记流程',
                type: 1
            },
            {
                title: '医院用印申请流程',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '党建工作办公室',
        icon: 'partyBuilding',
        bac: '#FF2E00',
        showFlow: true,
        flows: [
            {
                title: '浙江大学医学院附属妇产科医院党委用印申请表',
                type: 1
            },
            {
                title: '个人医德医风年度考核流程',
                type: 2
            },
            {
                title: '浙江大学医学院附属妇产科医院教育基金会用印申请表',
                type: 2
            },
            {
                title: '医德医风社会医疗登记流程',
                type: 1
            },
            {
                title: '医院用印申请流程',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '纪委办公室(监察审计室)',
        icon: 'disciplineInspectionCommission',
        bac: '#FF8800',
        showFlow: true,
        flows: [
            {
                title: '行玫值班呼叫来院交通补助申请流程',
                type: 2
            },
            {
                title: '员工奖励事由记录确认单',
                type: 2
            },
            {
                title: '麻醉记录单',
                type: 2
            },
            {
                title: '浙江大学医学院附属妇产科医院党委用印申请表',
                type: 2
            }
        ]
    },
    {
        title: '宣传部',
        icon: 'propaganda',
        bac: '#05D2D0',
        showFlow: true,
        flows: [
            {
                title: '行玫值班呼叫来院交通补助申请流程',
                type: 2
            },
            {
                title: '员工奖励事由记录确认单',
                type: 2
            },
            {
                title: '麻醉记录单',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '对外联络办公室',
        icon: 'externalLiaison',
        bac: '#A45EEB',
        showFlow: true,
        flows: [
            {
                title: '行玫值班呼叫来院交通补助申请流程',
                type: 2
            },
            {
                title: '员工奖励事由记录确认单',
                type: 2
            },
            {
                title: '麻醉记录单',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '医德医风管理类',
        icon: 'medicalEthics',
        bac: '#3370FF',
        showFlow: true,
        flows: [
            {
                title: '行玫值班呼叫来院交通补助申请流程',
                type: 2
            },
            {
                title: '员工奖励事由记录确认单',
                type: 2
            },
            {
                title: '麻醉记录单',
                type: 2
            },
            {
                title: '(休)假申请单',
                type: 2
            }
        ]
    },
    {
        title: '其他',
        icon: 'medicalEthics',
        bac: '#3370FF',
        showFlow: true,
        flows: []
    }
])
// 获取数据
const getDeptList = async () => {
    try {

        const params = {
            current: 1,
            size: 100
        }
        const res = await getList(params.current, params.size)
        res.data.data.records.forEach(record => {
            record.title = record.name
            record.dept = '演示表单'
            flowList.value.push(record)
            oftenList.value.push(record)
        })
        list.value[0].flows = deptList.value[0].flows = res.data.data.records
        list.value[list.value.length - 1].flows = deptList.value[deptList.value.length - 1].flows = res.data.data.records
        if (keyword.value.trim() === '') {
            return deptList.value = list.value
        }
        const arr = JSON.parse(JSON.stringify(list.value))
        deptList.value = arr.filter(item => {
            item.flows = item.flows.filter(flow => {
                if (flow.title.includes(keyword.value)) {
                    const replaceReg = new RegExp(keyword.value, 'ig')
                    const replaceString = `<span style="color: #FF2E00">${keyword.value}</span>`
                    flow.title = flow.title.replace(replaceReg, replaceString)
                }
                return flow.title.includes(keyword.value)
            })
            return item.flows.length > 0
        })
    } catch (e) {
        console.log(e)
    }
}
// getDeptList()

// 点击流程
// 动态路由跳转
const dynamicRoute = (row, type, async = false) => {
    const { id, taskId, processInstanceId, processId, formKey, formUrl, processDefKey } = row;
    if(!id) return
    let param = window.btoa(
        JSON.stringify({
            processId: id,
            taskId,
            processInsId: processInstanceId || processId,
            processDefKey,
        })
    );
    return new Promise(resolve => {
        if (formKey && formKey.startsWith('wf_ex_')) {
            if (formUrl) {
                // 配置了自定义路由
                router.push(formUrl + `?p=${param}`);
            } else {
                // 动态添加路由
                router.addRoute({
                    path: `/workflow/process/external`,
                    component: Layout,
                    children: [
                        {
                            path: `${formKey.substring(6)}/${type}`,
                            name:
                                type == 'start'
                                    ? `发起流程${formKey.substring(6)}`
                                    : `流程详情${formKey.substring(6)}`,
                            component: () => import(`../plugin/workflow/pages/external/${formKey.substring(6)}/${type}.vue`),
                        },
                    ],
                });
                router.push(
                    `/workflow/process/external/${formKey.substring(6)}/${type}?p=${param}`
                );
            }
        } else {
            if (async) {
                resolve({
                    row,
                    type,
                    param,
                });
            } else {
                router.push(`/workflow/process/${type}/${param}`);
            }
        }
    });
}

const hover = ref('')
const getImg = (item, type) => {
    if (type === 'dept') {
        return `/img/flow/${item.icon}.png`
    }
    return `/img/flow/${item.icon === hover.value ? item.icon + '_hover' : item.icon + '_default'}.png`
}

const add0ftenVisible = ref(false)
const flowList = ref([
    {
        dept: '演示表单',
        checked: false,
        title: '浙江大学医学院附属妇产科医院党委用印申请表',
        type: 1,
    },
    {
        dept: '演示表单',
        checked: false,
        title: '个人医德医风年度考核流程',
        type: 2
    },
    {
        dept: '演示表单',
        checked: false,
        title: '浙江大学医学院附属妇产科医院教育基金会用印申请表',
        type: 1
    },
    {
        dept: '演示表单',
        checked: false,
        title: '医德医风社会医疗登记流程',
        type: 1
    },
    {
        dept: '演示表单',
        checked: false,
        title: '医院用印申请流程',
        type: 2
    },
    {
        dept: '演示表单',
        checked: false,
        title: '(休)假申请单',
        type: 2
    },
    {
        dept: '党建工作办公室',
        checked: false,
        title: '浙江大学医学院附属妇产科医院党委用印申请表',
        type: 1
    },
    {
        dept: '党建工作办公室',
        checked: false,
        title: '个人医德医风年度考核流程',
        type: 2
    },
    {
        dept: '党建工作办公室',
        checked: false,
        title: '浙江大学医学院附属妇产科医院教育基金会用印申请表',
        type: 2
    },
    {
        dept: '党建工作办公室',
        checked: false,
        title: '医德医风社会医疗登记流程',
        type: 1
    },
    {
        dept: '党建工作办公室',
        checked: false,
        title: '医院用印申请流程',
        type: 2
    },
    {
        dept: '党建工作办公室',
        checked: false,
        title: '(休)假申请单',
        type: 2
    },
    {
        dept: '纪委办公室(监察审计室)',
        checked: false,
        title: '行玫值班呼叫来院交通补助申请流程',
        type: 2
    },
    {
        dept: '纪委办公室(监察审计室)',
        checked: false,
        title: '员工奖励事由记录确认单',
        type: 2
    },
    {
        dept: '纪委办公室(监察审计室)',
        checked: false,
        title: '麻醉记录单',
        type: 2
    },
    {
        dept: '纪委办公室(监察审计室)',
        checked: false,
        title: '浙江大学医学院附属妇产科医院党委用印申请表',
        type: 2
    },
    {
        dept: '宣传部',
        checked: false,
        title: '行玫值班呼叫来院交通补助申请流程',
        type: 2
    },
    {
        dept: '宣传部',
        checked: false,
        title: '员工奖励事由记录确认单',
        type: 2
    },
    {
        dept: '宣传部',
        checked: false,
        title: '麻醉记录单',
        type: 2
    },
    {
        dept: '宣传部',
        checked: false,
        title: '(休)假申请单',
        type: 2
    },
    {
        dept: '对外联络办公室',
        checked: false,
        title: '行玫值班呼叫来院交通补助申请流程',
        type: 2
    },
    {
        dept: '对外联络办公室',
        checked: false,
        title: '员工奖励事由记录确认单',
        type: 2
    },
    {
        dept: '对外联络办公室',
        checked: false,
        title: '麻醉记录单',
        type: 2
    },
    {
        dept: '对外联络办公室',
        checked: false,
        title: '(休)假申请单',
        type: 2
    },
    {
        dept: '医德医风管理类',
        checked: false,
        title: '行玫值班呼叫来院交通补助申请流程',
        type: 2
    },
    {
        dept: '医德医风管理类',
        checked: false,
        title: '员工奖励事由记录确认单',
        type: 2
    },
    {
        dept: '医德医风管理类',
        checked: false,
        title: '麻醉记录单',
        type: 2
    },
    {
        dept: '医德医风管理类',
        checked: false,
        title: '(休)假申请单',
        type: 2
    }
])
const activeDept = ref('all')

// 点击显示添加常用流程对话框
const handleAddOften = () => {
    oftenList.value.forEach(often => {
        flowList.value.forEach(flow => {
            if(often.dept === flow.dept && often.title === flow.title) {
                flow.checked = true
            }
        })
    })
    add0ftenVisible.value = true
}

// 清空所有选中的流程
const clearActiveFlow = () => {
    flowList.value.forEach(item => {
        item.checked = false
    })
}

// 确认添加常用流程
const onSaveAdd0ftenVisible = () => {
    add0ftenVisible.value = false
    oftenList.value = flowList.value.filter(item => item.checked)
}

// 点击左侧科室滚动到指定科室流程
const scrollToDept = (item) => {
    const depts = document.querySelectorAll('.all-flow-main-right .dept-item .dept-title')
    const main_right = document.querySelector('.all-flow-main-right')
    depts.forEach(dept => {
        if(dept.innerHTML === item.title) {
          console.log(dept.offsetTop)
            main_right.scrollTop = dept.offsetTop - 679
        }
    })
}
</script>

<style lang="scss" scoped>
.flex-jcsb-aic {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container {
    width: 1440px;
    margin: 0 auto;

    .often {
        background-color: #fff;
        padding: 27px 20px;

        .often-title {
            padding-left: 10px;
            border-left: 3px solid #3370FF;
            font-size: 20px;
            font-weight: bold;
            color: #0F1114;
        }

        .often-list {
            display: flex;
            flex-wrap: wrap;
            margin-top: 16px;

            .often-item {
                position: relative;
                display: flex;
                align-items: center;
                width: 325px;
                margin: 0 0 20px 20px;
                padding: 14px 16px;
                border-radius: 8px;
                border: 1px solid #DDDDDD;
                cursor: pointer;
                box-sizing: border-box;

                &:hover {
                    background: #F5F9FD;
                    border: 1px solid #3370FF;
                }

                .often-close {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    background: #E9EFFF;
                    border-radius: 50% 50%;
                    color: #3370FF;
                }

                .icon {
                    width: 48px;
                    height: 48px;
                    background: #d6e2ff;
                    margin-right: 10px;
                    text-align: center;
                    line-height: 58px;
                    border-radius: 12px;
                }

                .often-info {
                    p {
                        line-height: 1.5;
                        font-size: 14px;
                    }

                    .cate {
                        color: #666;
                    }
                }
            }

            .add-often {
                display: flex;
                align-items: center;
                width: 325px;
                margin: 0 0 20px 20px;
                padding: 14px 16px;
                border-radius: 8px;
                border: 1px solid #DDDDDD;
                cursor: pointer;
                box-sizing: border-box;

                .icon {
                    width: 48px;
                    height: 48px;
                    background: #ebedf0;
                    margin-right: 10px;
                    text-align: center;
                    line-height: 58px;
                    border-radius: 12px;
                }
            }
        }
    }

    .all-flow {
        .all-flow-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #F5F9FD;
            margin-top: 20px;
            padding: 20px 45px 24px 20px;

            .all-flow-header-title {
                padding-left: 10px;
                border-left: 3px solid #3370FF;
                font-size: 20px;
                font-weight: bold;
                color: #0F1114;
            }

            .all-flow-search {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 545px;
                font-size: 14px;

                :deep(.el-input__icon) {
                    color: #3370FF;
                }

                .el-input {
                    width: 400px;
                    height: 36px;
                }
            }
        }

        .all-flow-main {
            display: flex;
            height: 750px;
            min-height: calc(100vh - 360px);
            background-color: #fff;
            overflow: hidden;


            .all-flow-main-left {
                width: 300px;
                height: 100%;
                overflow: scroll;
                padding: 25px 20px;
                border-right: 1px solid #DDDDDD;

                .dept-item {
                    display: flex;
                    padding: 20px 0;
                    border-top: 1px solid #DDDDDD;
                    cursor: pointer;

                    &:hover {
                        font-weight: bold;
                        color: #3370FF;
                    }

                    &:last-child {
                        border-bottom: 1px solid #DDDDDD;
                    }

                    img {
                        margin-right: 10px;
                    }
                }
            }

            .all-flow-main-right {
                flex: 1;
                //min-height: 100%;
                overflow: scroll;
                padding: 25px;

                .dept-item {
                    margin-top: 15px;

                    &:first-child {
                        .item-header .dept-info .icon img {
                            width: 32px;
                            padding: 0;
                        }
                    }

                    .item-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #ddd;

                        .dept-info {
                            display: flex;
                            align-items: center;
                            margin-left: 17px;

                            .icon {
                                width: 32px;
                                height: 32px;
                                margin-right: 10px;

                                img {
                                    width: 20px;
                                    padding: 6px;
                                }
                            }

                            .dept-title {
                                font-size: 20px;
                                font-weight: bold;
                            }
                        }

                        .show-flow {
                            display: flex;
                            align-items: center;
                            color: #3370FF;
                            cursor: pointer;
                        }
                    }

                    .flow-list {
                        display: flex;
                        flex-wrap: wrap;
                        padding-top: 20px;

                        .list-item {
                            display: flex;
                            align-items: center;
                            width: 50%;
                            margin-bottom: 15px;
                            padding: 12px 22px;
                            cursor: pointer;
                            box-sizing: border-box;

                            &:hover {
                                background: #F5F9FD;
                                border: 1px solid #3370FF;
                                border-radius: 4px;
                                font-weight: bold;
                                color: #3370FF;
                            }

                            .el-icon {
                                margin-right: 10px;
                            }
                        }
                    }

                }
            }
        }
    }

    .el-dialog {
        .dialog-title {
            position: relative;
            padding-left: 10px;
            padding-bottom: 15px;

            border-bottom: 1px solid #D9D9D9;
            font-weight: bold;
            color: #0F1114;

            &::before {
                position: absolute;
                left: 0;
                content: '';
                display: block;
                width: 3px;
                height: 16px;
                background-color: #3370FF;

            }
        }

        .search {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 545px;
            margin: 0 auto;
            font-size: 14px;

            :deep(.el-input__icon) {
                color: #3370FF;
            }

            .el-input {
                width: 400px;
                height: 36px;
            }
        }

        .main {
            display: flex;
            margin-top: 24px;
            border: 1px solid #DDDDDD;
            border-radius: 6px;

            .dept {
                width: 182px;
                height: calc(100vh - 500px);
                border-right: 1px solid #DDDDDD;
                overflow: scroll;

                .dept-item {
                    padding: 10px 16px;
                    cursor: pointer;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }

                .active-dept {
                    background: #F5F9FD;
                    color: #3370FF;
                }
            }

            .flow {
                width: 340px;
                height: calc(100vh - 500px);
                padding: 0 17px;
                border-right: 1px solid #DDDDDD;
                box-sizing: border-box;
                overflow: scroll;

                .flow-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    p {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }

            .active {
                flex: 1;
                height: calc(100vh - 500px);
                overflow: scroll;

                .clear {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 15px;
                }

                .active-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 15px;

                    p {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }

                    .el-icon {
                        cursor: pointer;
                    }

                }
            }
        }
    }

    :deep(.el-dialog__close) {
        font-size: 18px;
        color: #3370FF;
    }

    .el-button--primary {
        --el-button-bg-color: #3370FF;
        --el-button-border-color: #3370FF;
        --el-button-hover-bg-color: #3370FF;
        --el-button-hover-border-color: #3370FF;
    }
}
</style>
