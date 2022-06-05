<template>
    <el-config-provider :locale="zhCn">
        <div class="popup">
            <div 
                class="switcher" 
                :class="`switcher--${status ? 'enabled' : 'disabled'}`"
                title="在当前网站启用/关闭"
                @click="switchStatus"
            >
                <div class="switcher-bar"></div>
                <div class="switcher-btn">
                    <el-icon 
                        :color="status ? '#409EFF' : '#F56C6C'"
                        :size="20"
                    >
                        <Check v-if="status"/>
                        <Close v-else/>
                    </el-icon>
                </div>
            </div>
            <!-- <el-icon 
                class="setting" 
                :size="20"
                title="设置"
            ><Setting /></el-icon> -->
        </div>
    </el-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { Setting, Check, Close } from '@element-plus/icons-vue'
import whitelist from '../utils/whitelist'
import { MessageHub, MESSAGE_TYPES } from '../utils/messageHub'

let currentHost = ''
const popupMsgHub = new MessageHub('content:popup')
const status = ref(true)

chrome.tabs.query({
        active: true, 
        lastFocusedWindow: true
    }, 
    (tabs) => {
        const url = tabs[0]?.url
        if (url) {
            currentHost = new URL(url).hostname
        }
        if (whitelist.has(currentHost)) {
            status.value = false
        }
    }
)

function switchStatus() {
    status.value = !status.value
    if (!status.value) {
        whitelist.add(currentHost)
    } else {
        whitelist.remove(currentHost)
    }

    popupMsgHub.sendTab(MESSAGE_TYPES.SWITCH, status.value)
}
</script>

<style lang="less">
[v-cloak] {
    display: none;
}

:root {
    --switch-enabled: linear-gradient(90deg, #409EFF 0%, #337ecc 100%);
    --switch-disabled: linear-gradient(90deg, #c45656 0%, #F56C6C 100%);
    --switch-btn-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

body {
    margin: 0;
    padding: 0;
}

.popup {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 15px;

    .setting {
        margin-left: 25px;
        color: #888;
        cursor: pointer;

        &:hover {
            color: #333;
        }
    }
}

.switcher {
    position: relative;
    cursor: pointer;
    width: 70px;

    &-bar {
        width: 100%;
        height: 30px;
        border-radius: 100px;
    }

    &-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 40px;
        height: 40px;
        top: 50%;
        border-radius: 50%;
        box-shadow: var(--switch-btn-shadow);
        background-color: #fff;
        transition: all 0.3s ease;
        cursor: pointer;

        // &:hover {
        //     box-shadow: 0 0 0 6px rgb(0 0 0 / 10%);
        // }
    }

    &--enabled &-bar {
        background-image: var(--switch-enabled);
    }
    &--enabled &-btn {
        right: 0;
        transform: translate(10%, -50%);
    }

    &--disabled &-bar {
        background-image: var(--switch-disabled);
    }
    &--disabled &-btn {
        left: 0;
        transform: translate(-10%, -50%);
    }
}
</style>
