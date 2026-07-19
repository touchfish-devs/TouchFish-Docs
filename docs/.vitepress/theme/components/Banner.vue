<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(true)

onMounted(() => {
  const bannerClosed = localStorage.getItem('touchfish-banner-closed')
  if (bannerClosed === 'true') {
    isVisible.value = false
  }
})

const closeBanner = () => {
  isVisible.value = false
  localStorage.setItem('touchfish-banner-closed', 'true')
}
</script>

<template>
  <div v-if="isVisible" class="banner">
    <div class="banner-content">
      <img src="/svg/touchfish.svg" alt="TouchFish" class="banner-icon" />
      <span class="banner-text">TouchFish V5 全新架构，敬请期待！</span>
      <a href="/guide/v5" class="learn-more">查看详情 →</a>
    </div>
    <button class="close-btn" @click="closeBanner" aria-label="关闭横幅">
      ✕
    </button>
  </div>
</template>

<style scoped>
.banner {
  background-color: #1e90ff;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.banner-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
}

.banner-text {
  display: inline-block;
}

.learn-more {
  color: white;
  text-decoration: none;
  margin-left: 12px;
  font-weight: 600;
  transition: opacity 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  padding-bottom: 1px;
}

.learn-more:hover {
  opacity: 0.8;
  border-bottom-color: white;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 0.8;
}

.close-btn:active {
  opacity: 0.6;
}
</style>
