<template>
    <div class="container-list">
        <div class="list-item" v-for="(item, index) in list" :key="index">
            <p>{{ item.title }}</p>
            <span class="timer">{{ item.timer }}</span>
        </div>
    </div>
</template>

<script setup>
let props = defineProps({
    list: Array
})
</script>

<style lang="scss" scoped>
.container-list {
    margin-top: 10px;

    .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding: 20px 0;
        border-bottom: 1px solid #c4c4c4;
        cursor: pointer;

        &::before {
            content: '';
            display: block;
            width: 5px;
            height: 5px;
            background: #c4c4c4;
            border-radius: 50%;
        }

        &:hover {
            border-bottom: 1px solid #3370FF;
            color: #3370FF !important;

            &::before {
                background: #3370FF;
            }

            .timer {
                color: #3370FF;
            }
        }

        p {
            width: 300px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }


        .timer {
            margin-left: 8px;
            color: #9DA6B2;
        }
    }
}
</style>
