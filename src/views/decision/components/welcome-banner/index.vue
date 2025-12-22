<template>
  <div class="welcome-banner">
    <div class="welcome-text">
      <h2>尊敬的{{ userName }}，议事决策管理平台欢迎您！</h2>
      <p class="subtitle">议事决策相关标语区域，议事决策相关标语区域</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeBanner',
  props: {
    userName: {
      type: String,
      default: 'xxx'
    }
  }
};
</script>

<style scoped lang="scss">
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 40px;
  border-radius: 8px;
  margin-bottom: 30px;

  .welcome-text {
    h2 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 500;
    }

    .subtitle {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }
  }
}
</style>
