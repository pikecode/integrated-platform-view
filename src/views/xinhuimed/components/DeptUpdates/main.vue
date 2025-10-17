<template>
    <div class="container-list">
        <div :class="{'list-item': true}" v-for="item in list" :key="item.id">
            <div class="date">
                <p class="day">{{item.create_at_day}}</p>
                <p>{{item.create_at}}</p>
            </div>
            <div class="main">
                <p class="title">{{item.title}}</p>
                <p class="content">{{item.content}}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

let props = defineProps({
    list: Array
})

const active = ref('')
const handleActiveItem = (item) => {
    active.value = item.id
    console.log(active.value)
}

</script>

<style lang="scss" scoped>
.container-list {
    margin-top: 24px;

    .list-item {
        display: flex;
        align-items: center;
        margin-top: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #DDDDDD;
        cursor: pointer;

        &:hover {
            .date {
                background-color: #3370FF;
            }

            .title {
                font-weight: bold;
                color: #3370FF;
            }
        }

        p {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .date {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: #99C2FF;
            margin-right: 12px;
            border-radius: 8px;

            p {
                font-size: 12px;
                color: #fff;
            }

            .day {
                margin-bottom: 8px;
                font-size: 20px;
            }
        }

        .main {
            flex: 1;
            .content {
                margin-top: 12px;
                color: #9DA6B2;
            }
        }
    }
}
</style>
