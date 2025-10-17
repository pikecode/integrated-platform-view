<template>
    <div>
        <div class="container-list">
            <div class="list-item" v-for="(item, index) in list" :key="index">
                <p><span class="timer">{{ item.timer }}</span>{{ item.title }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    list: Array
})

</script>

<style lang="scss" scoped>

.container-list {
    margin-top: 24px;

    .list-item {
        height: 64px;
        margin-bottom: 18px;
        padding: 24px 20px;
        box-sizing: border-box;

        p {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        &:hover {
            background: #F5F9FD;
            border-radius: 8px 8px 8px 8px;
            border: 1px solid #3370FF;

            p {
                color: #3370FF;
            }
        }

        .timer {
            margin-right: 8px;
            color: #9DA6B2;
        }
    }
}
</style>
