<template>
  <div>
    <nav class="navbar">
      <div class="navbar-logo" @click="goToHome">
        Devforth Challenge
      </div>
      <div class="navbar-links">
        <button class="nav-btn" @click="goToChart">Chart</button>
        <button class="nav-btn" @click="goToResult">Result</button>
      </div>
    </nav>

    <div class="container">
      <div class="game-block">
        <div class="dice-block gradient-border">
          <h2>Dice</h2>
          <div class="dice-items">
            <div v-for="(d, i) in game.dice"
                 :key="i"
                 class="dice"
                 :class="{ rolling: game.rolling }">
              {{ game.rolling ? Math.floor(Math.random() * 6) + 1 : d ?? "?" }}
            </div>
          </div>
          <hr class="line">
          <div class="padding">
            <p style="text-align:center; font-size:18px; font-weight:bold;">{{ game.message }}</p>
          </div>
        </div>

        <div class="prices-block gradient-border">
          <h2>Prices</h2>
          <div class="prices-content">
            <div class="price-row">
              <span class="name">Pair</span>
              <span class="multiplier">x{{ game.odds.pair.toFixed(3) }}</span>
            </div>
            <div class="price-row">
              <span class="name">Full House</span>
              <span class="multiplier">x{{ game.odds.fullHouse.toFixed(3) }}</span>
            </div>
            <div class="price-row">
              <span class="name">Balut</span>
              <span class="multiplier">x{{ game.odds.balut.toFixed(3) }}</span>
            </div>
            <div class="price-row">
              <span class="name">Straight</span>
              <span class="multiplier">x{{ game.odds.straight.toFixed(3) }}</span>
            </div>
          </div>
        </div>

        <div class="bet-block gradient-border">
          <h2>Bet</h2>
          <div class="bet-content">
            <input v-model="game.bet" type="number" placeholder="Enter bet">
            <button class="roll" @click="game.rollDice" :disabled="game.rolling">
              {{ game.rolling ? "Rolling..." : "Roll" }}
            </button>
          </div>
        </div>

        <div class="your-balance-block gradient-border">
          <h2>Your balance</h2>
          <div class="balance">{{ game.balance }}</div>
        </div>
      </div>

      <div class="info-block">
        <div class="gradient-border">
          <slot/>
        </div>
      </div>
    </div>

    <div class="button-wrapper">
      <button class="blue big" @click="openModal">Simulate</button>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content gradient-border">
        <h2>Simulation Result</h2>
        <pre>{{ simulationMessage }}</pre>
        <button class="blue" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref } from "vue";
import { useGameStore } from "@/stores/game";
import { useRouter } from "vue-router";

const game = useGameStore();
const router = useRouter();

const showModal = ref(false);
const simulationMessage = ref("");

function goToHome() {
  router.push("/");
}
function goToChart() {
  router.push("/game/chart");
}
function goToResult() {
  router.push("/game/result");
}


function openModal() {
  simulationMessage.value = game.simulateRTP();
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

</script>



<style>
body {
  background-color: #1e1e2f;
  color: white;
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h2 {
  display: flex;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  user-select: none;

  background: linear-gradient(45deg, #FF0080, #00F0FF, #7A00FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.line {
  border: none;
  height: 1px;
  background: linear-gradient(to right, #5633E3 0%, #FF0080 50%, #5633E3 100%);
  border-radius: 2px;
  margin: 20px 0;
}


.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: #1e1e2f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.4),
  0 0 25px rgba(0, 240, 255, 0.4),
  0 0 35px rgba(122, 0, 255, 0.4);
  z-index: 1000;
}

.navbar-logo {
  font-size: 22px;
  font-weight: bold;
  padding: 40px;
  cursor: pointer;


  background: linear-gradient(45deg, #FF0080, #00F0FF, #7A00FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-links {
  display: flex;
  gap: 40px;
  padding-right: 40px;
}

.nav-btn {
  background: linear-gradient(to right, #5633E3 0%, #FF0080 50%, #5633E3 100%);
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.6),
  0 0 15px rgba(0, 240, 255, 0.6),
  0 0 20px rgba(122, 0, 255, 0.6);
}

.nav-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.8),
  0 0 25px rgba(0, 240, 255, 0.8),
  0 0 35px rgba(122, 0, 255, 0.8);
}

.gradient-border {
  border: 4px solid transparent;
  border-radius: 12px;
  background: linear-gradient(#1e1e2f, #1e1e2f) padding-box,
  linear-gradient(to right, #FF0080, #00F0FF, #7A00FF) border-box;
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.5),
  0 0 25px rgba(0, 240, 255, 0.5),
  0 0 35px rgba(122, 0, 255, 0.5);
}

.container {
  display: flex;
  justify-content: center;
  max-width: 1200px;
  height: 550px;
  gap: 60px;
  margin: 0 auto;
}

.game-block {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  padding: 15px;
  width: 800px;
}

.dice-block {
  width: 800px;
  margin: 0 auto;
  grid-area: 1 / 1 / 2 / 3;
}

.dice-items {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 30px;
}

.padding p{
  padding: 10px;
  background: linear-gradient(to right, #5633E3 0%, #FF0080 50%, #5633E3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dice {
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 12px;
  position: relative;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 22px;
  color: black;
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.6),
  0 0 15px rgba(0, 240, 255, 0.6),
  0 0 20px rgba(122, 0, 255, 0.6);
}
.dice:empty::before {
  content: '?';
  color: #666;
  font-size: 28px;
}

@keyframes roll {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(90deg); }
  50%  { transform: rotate(180deg); }
  75%  { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
}

.dice.rolling {
  animation: roll 0.6s linear infinite;
  background: linear-gradient(45deg, #FF0080, #00F0FF, #7A00FF);
  color: white;
}

.prices-block{
  grid-area: 2 / 1 / 4 / 2;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.prices-content {
  display: grid;
  grid-area: 2 / 1 / 4 / 2;
  grid-template-columns: 1fr auto;
  row-gap: 6px;
  align-content: start;
  padding: 10px;
}

.price-row {
  display: contents;
}

.name {
  font-size: 22px;
  font-weight: 700;
}

.multiplier {
  font-size: 20px;
  font-weight: 700;
  text-align: right;
}

.name {
  font-weight: 500;
}

.multiplier {
  font-weight: 700;
}

.bet-block{
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.bet-content {
  display: flex;
  gap: 15px;
  padding: 15px;
}

.bet-content input,
.bet-content button {
  flex: 1;
  height: 50px;
  width: 150px;
  font-size: 18px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 0 12px;
  box-sizing: border-box;
}

.bet-content input{
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.6),
  0 0 15px rgba(0, 240, 255, 0.6),
  0 0 20px rgba(122, 0, 255, 0.6);
}

.bet-content button {
  background: linear-gradient(to right, #5633E3 0%, #FF0080 50%, #5633E3 100%);
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.bet-content button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.8),
  0 0 25px rgba(0, 240, 255, 0.8),
  0 0 35px rgba(122, 0, 255, 0.8);

}

.your-balance-block {
  grid-area: 3 / 2 / 4 / 3;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  padding-bottom: 15px;

}
.balance{
  display: flex;
  justify-content: center;
  font-size: 28px;
}

.info-block{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 70px;
  width: 900px;
}

.blue {
  background: linear-gradient(to right, #5633E3 0%, #FF0080 50%, #5633E3 100%);
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.6),
  0 0 15px rgba(0, 240, 255, 0.6),
  0 0 20px rgba(122, 0, 255, 0.6);
}

.blue:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.8),
  0 0 25px rgba(0, 240, 255, 0.8),
  0 0 35px rgba(122, 0, 255, 0.8);
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.big{
  margin-top: 50px;
  width: 550px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 47, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #1e1e2f;
  padding: 30px;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-content pre {
  white-space: pre-line;
  font-size: 16px;
  font-family: monospace;
}

@media (max-width: 1800px) {
  .container {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;
    height: auto;
    max-width: 100%;
    padding-top: 100px;
  }

  .game-block {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    width: 800px;
    gap: 20px;
    padding: 15px;
  }

  .dice-block { grid-area: 1 / 1 / 2 / 3; width: 100%; }
  .prices-block { grid-area: 2 / 1 / 4 / 2; width: 100%; }
  .bet-block { grid-area: 2 / 2 / 3 / 3; width: 100%; }
  .your-balance-block { grid-area: 3 / 2 / 4 / 3; width: 100%; }

  .dice-items {
    gap: 15px;
    padding: 15px;
  }

  .dice {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  .balance {
    font-size: 22px;
  }

  .nav-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .blue.big {
    width: 100%;
    max-width: 400px;
    margin: 0;
  }

  .button-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
  }
}
@media (max-width: 950px) {
  .container {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;
    height: auto;
    max-width: 100%;
    padding-top: 100px;
  }

  .game-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    max-width: 500px;
  }

  .dice-block,
  .prices-block,
  .bet-block,
  .your-balance-block,
  .info-block,
  .gradient-border {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  .dice-items {
    gap: 15px;
    padding: 15px;
  }

  .dice {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  .balance {
    font-size: 22px;
  }

  .nav-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .blue.big {
    width: 100%;
    max-width: 400px;
    margin: 0;
  }

  .button-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
  }
}

</style>
