<template>
  <basic-container>
    <!-- 面包屑导航 -->
    <decision-breadcrumb :breadcrumbs="['数据看板']" />

    <!-- 时间段筛选 -->
    <div class="time-filter">
      <span class="filter-label">议事决策 / 数据看板</span>
      <div class="filter-tabs">
        <el-button
          v-for="tab in timeTabs"
          :key="tab.value"
          :type="selectedTimeTab === tab.value ? 'primary' : 'default'"
          size="small"
          @click="selectedTimeTab = tab.value"
        >
          {{ tab.label }}
        </el-button>
      </div>
    </div>

    <!-- 议题和任务统计卡片 -->
    <el-row :gutter="20" class="stat-cards-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon topic-icon">
            <i class="el-icon-document"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">发布议题总数</div>
            <div class="stat-value">126</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon topic-icon">
            <i class="el-icon-document"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">已上会议题总数</div>
            <div class="stat-value">86</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon task-icon">
            <i class="el-icon-s-management"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">任务总数</div>
            <div class="stat-value">234</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon task-icon">
            <i class="el-icon-s-management"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">完成任务总数</div>
            <div class="stat-value">24</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 议题和任务统计图表 -->
    <el-row :gutter="20" class="chart-row">
      <!-- 议题统计 -->
      <el-col :span="12">
        <div class="chart-container">
          <!-- 议题状态统计 -->
          <div class="chart-section">
            <h3>议题状态统计</h3>
            <div class="chart-wrapper">
              <div id="topic-status-chart" class="chart" />
            </div>
          </div>

          <!-- 议题阶段统计 -->
          <div class="chart-section">
            <h3>议题阶段统计</h3>
            <div class="chart-wrapper">
              <div id="topic-stage-chart" class="chart" />
            </div>
          </div>
        </div>
      </el-col>

      <!-- 任务统计 -->
      <el-col :span="12">
        <div class="chart-container">
          <!-- 任务状态统计 -->
          <div class="chart-section">
            <h3>任务状态统计</h3>
            <div class="chart-wrapper">
              <div id="task-status-chart" class="chart" />
            </div>
          </div>

          <!-- 任务反馈率 -->
          <div class="chart-section">
            <h3>任务反馈率</h3>
            <div class="chart-wrapper">
              <div id="task-feedback-chart" class="chart-circle" />
              <div class="feedback-hint">
                <p>已反馈的任务/总任务 同一个任务，执行人和 配合人都反馈算这个任 务反馈</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import DecisionBreadcrumb from '../components/breadcrumb.vue';
import * as echarts from 'echarts';

export default {
  name: 'DecisionDashboard',
  components: {
    DecisionBreadcrumb
  },
  data() {
    return {
      selectedTimeTab: '7days',
      timeTabs: [
        { label: '近7天', value: '7days' },
        { label: '近30天', value: '30days' },
        { label: '近半年', value: '6months' }
      ],
      topicStatusChart: null,
      topicStageChart: null,
      taskStatusChart: null,
      taskFeedbackChart: null
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    selectedTimeTab() {
      this.loadCharts();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts();
    });
  },
  beforeUnmount() {
    if (this.topicStatusChart) this.topicStatusChart.dispose();
    if (this.topicStageChart) this.topicStageChart.dispose();
    if (this.taskStatusChart) this.taskStatusChart.dispose();
    if (this.taskFeedbackChart) this.taskFeedbackChart.dispose();
  },
  methods: {
    initCharts() {
      this.initTopicStatusChart();
      this.initTopicStageChart();
      this.initTaskStatusChart();
      this.initTaskFeedbackChart();
    },

    loadCharts() {
      this.initCharts();
    },

    initTopicStatusChart() {
      const chartDom = document.getElementById('topic-status-chart');
      if (!chartDom) return;

      this.topicStatusChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '议题状态',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 35, name: '议题申请中', itemStyle: { color: '#5470C6' } },
              { value: 25, name: '上会申请中', itemStyle: { color: '#91CC75' } },
              { value: 20, name: '待上会', itemStyle: { color: '#FAC858' } },
              { value: 12, name: '已上会', itemStyle: { color: '#EE6666' } },
              { value: 8, name: '结论审批中', itemStyle: { color: '#73C0DE' } },
              { value: 5, name: '结论录入完成', itemStyle: { color: '#B3E5FC' } }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.topicStatusChart.setOption(option);
    },

    initTopicStageChart() {
      const chartDom = document.getElementById('topic-stage-chart');
      if (!chartDom) return;

      this.topicStageChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '15%',
          right: '10%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['议题提交', '申请上会', '议题上会', '结论录入完成']
        },
        series: [
          {
            data: [56, 75, 54, 20],
            type: 'bar',
            itemStyle: {
              color: '#5470C6'
            }
          }
        ]
      };
      this.topicStageChart.setOption(option);
    },

    initTaskStatusChart() {
      const chartDom = document.getElementById('task-status-chart');
      if (!chartDom) return;

      this.taskStatusChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '任务状态',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 45, name: '审批中', itemStyle: { color: '#FAC858' } },
              { value: 78, name: '进行中', itemStyle: { color: '#5470C6' } },
              { value: 111, name: '已完成', itemStyle: { color: '#EE6666' } }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.taskStatusChart.setOption(option);
    },

    initTaskFeedbackChart() {
      const chartDom = document.getElementById('task-feedback-chart');
      if (!chartDom) return;

      this.taskFeedbackChart = echarts.init(chartDom);
      const option = {
        series: [
          {
            type: 'gauge',
            startAngle: 225,
            endAngle: -45,
            radius: '80%',
            center: ['50%', '60%'],
            min: 0,
            max: 100,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.3, '#FFC107'],
                  [1, '#E0E0E0']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 4
              }
            },
            axisLabel: {
              color: 'auto',
              distance: 40,
              fontSize: 12
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%',
              color: 'auto',
              fontSize: 20
            },
            data: [{ value: 65, name: '反馈率' }]
          }
        ]
      };
      this.taskFeedbackChart.setOption(option);
    }
  }
};
</script>

<style scoped lang="scss">
.time-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  .filter-label {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .filter-tabs {
    display: flex;
    gap: 10px;
  }
}

.stat-cards-row {
  margin-bottom: 30px;

  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;

      &.topic-icon {
        background: linear-gradient(135deg, #FEC84B 0%, #FFD666 100%);
      }

      &.task-icon {
        background: linear-gradient(135deg, #FF7875 0%, #FF4D4F 100%);
      }
    }

    .stat-content {
      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 32px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
}

.chart-row {
  .chart-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .chart-section {
      margin-bottom: 30px;

      &:last-child {
        margin-bottom: 0;
      }

      h3 {
        margin: 0 0 15px 0;
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        padding-left: 10px;
        border-left: 3px solid #409eff;
      }

      .chart-wrapper {
        position: relative;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;

        .chart {
          width: 100%;
          height: 300px;
        }

        .chart-circle {
          width: 100%;
          height: 300px;
        }

        .feedback-hint {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: #FCE4EC;
          border-left: 3px solid #E91E63;
          padding: 12px 15px;
          border-radius: 4px;
          width: 200px;
          font-size: 12px;
          color: #D81B60;
          line-height: 1.6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

          p {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
