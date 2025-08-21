<template>
  <div class="result-page">
    <div class="result-container">
      <h2>Game Results</h2>
      <div class="result-row">
        <span>Total Bets:</span>
        <span>{{ game.totalBets.toFixed(2) }}</span>
      </div>
      <div class="result-row">
        <span>Total Wins:</span>
        <span>{{ game.totalWins.toFixed(2) }}</span>
      </div>
      <div class="result-row">
        <span>RTP:</span>
        <span>{{ game.rtp.toFixed(2) }}%</span>
      </div>
    </div>
  </div>
</template>


<script setup>
definePageMeta({
  layout: "game"
});
import { computed } from "vue";
import { useGameStore } from "@/stores/game";

const game = useGameStore();

const rtp = computed(() => {
  return game.totalBets > 0 ? (game.totalWins / game.totalBets) * 100 : 0;
});
</script>



<style scoped>


.result-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
}

header {
  margin-bottom: 20px;
}

.result-container {
  background-color: #1e1e2f;
  padding: 20px 40px;
  border-radius: 12px;
  min-width: 400px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 18px;
  font-weight: 500;
}
</style>