<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions"/>
  </div>
</template>



<script setup>
definePageMeta({
  layout: "game"
});

import { ref, computed } from "vue";
import { useGameStore } from "@/stores/game";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const store = useGameStore();

const chartData = computed(() => ({
  labels: store.attemptsHistory.map(a => a.attempt),
  datasets: [
    {
      label: "Balance",
      data: store.attemptsHistory.map(a => a.balance),
      borderColor: "rgba(255, 0, 128, 0.6)",
      backgroundColor: "rgba(75,192,192,1)",
      tension: 0.4
    }
  ]
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true }
  },
  scales: {
    x: {
      title: { display: true, text: "Attempts" }
    },
    y: {
      title: { display: true, text: "Balance" }
    }
  }
};
</script>


<style scoped>
.chart-container {
  width: 800px;
  background-color: white;
}
@media (max-width: 2049px) {
  .chart-container {
    width: 800px;
    background-color: white;
  }
}

@media (max-width: 950px) {
  .chart-container {
    width: 500px;
    background-color: white;
  }
}

</style>
