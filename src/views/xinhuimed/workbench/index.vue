<template>
    <div class="work-container w">
        <GridLayout
            v-model:layout="layout"
            :col-num="100"
            :row-height="1"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :use-css-transforms="true"
            :margin="[10, 10]"
        >
            <GridItem v-for="item in layout"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h"
                       :i="item.i"
                       :key="item.i"
                       @moved="gridItemMoved(item)"
            >
                <TaskCenter v-if="item.i === 'TaskCenter'"/>
                <ListOfSubsystemsCard  v-if="item.i === 'ListOfSubsystemsCard'"/>
                <CommonForms  v-if="item.i === 'CommonForms'"/>
                <FastEntry  v-if="item.i === 'FastEntry'"/>
                <ShopCalendar  v-if="item.i === 'ShopCalendar'"/>
                <AnnouncementUpdates  v-if="item.i === 'AnnouncementUpdates'"/>
                <PersonalModule  v-if="item.i === 'PersonalModule'"/>
            </GridItem>
        </GridLayout>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { GridLayout, GridItem } from 'vue-grid-layout-v3'

import TaskCenter from "@/views/xinhuimed/workbench/components/TaskCenter.vue";
import ListOfSubsystemsCard from "@/views/xinhuimed/components/ListOfSubsystemsCard/main.vue"
import CommonForms from "@/views/xinhuimed/components/CommonForms/main.vue"
import FastEntry from "@/views/xinhuimed/components/FastEntry/main.vue"
import ShopCalendar from "@/views/xinhuimed/workbench/components/ShopCalendar.vue"
import AnnouncementUpdates from "@/views/xinhuimed/components/AnnouncementUpdates/main.vue";
import PersonalModule from "@/views/xinhuimed/workbench/components/PersonalModule.vue";


const layout = ref([
    { "x": 0, "y": 0, "w": 66, "h": 66, "i": "TaskCenter" },
    { "x": 0, "y": 1, "w": 66, "h": 61, "i": "ListOfSubsystemsCard" },
    { "x": 0, "y": 2, "w": 29.5, "h": 47, "i": "CommonForms" },
    { "x": 30, "y": 2, "w": 36, "h": 47, "i": "FastEntry" },
    { "x": 66, "y": 0, "w": 34, "h": 77, "i": "ShopCalendar" },
    { "x": 66, "y": 1, "w": 34, "h": 44, "i": "AnnouncementUpdates" },
    { "x": 66, "y": 2, "w": 34, "h": 53, "i": "PersonalModule" },
])

// 模块移动完成
const gridItemMoved = (item) => {
    console.log(layout.value)
    console.log(item)
}

</script>

<style lang="scss" scoped>
:deep(.el-tabs__item){
    font-size: 16px;
}
</style>
