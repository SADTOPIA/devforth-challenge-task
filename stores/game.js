import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
    state: () => ({
        balance: 100,
        bet: 0,
        dice: [null, null, null, null, null],
        rolling: false,
        message: "",
        totalBets: 0,
        totalWins: 0,
        rtp: 0,
        odds: {
            pair: 0.946,
            fullHouse: 1.419,
            balut: 1.892,
            straight: 2.364,
        },
        attemptsHistory: [] // для графика
    }),

    actions: {
        rollDice() {
            const betAmount = parseFloat(this.bet);
            if (!betAmount || betAmount <= 0) {
                this.message = "Enter valid bet!";
                return;
            }
            if (betAmount > this.balance) {
                this.message = "Not enough balance!";
                return;
            }

            this.balance = +(this.balance - betAmount).toFixed(2);
            this.totalBets = +(this.totalBets + betAmount).toFixed(2);
            this.rolling = true;
            this.message = "Rolling...";

            setTimeout(() => {
                this.dice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
                const result = this.checkCombination(this.dice, betAmount);

                this.balance = +(this.balance + result.win).toFixed(2);
                this.totalWins = +(this.totalWins + result.win).toFixed(2);
                this.rtp = this.totalBets > 0 ? (this.totalWins / this.totalBets) * 100 : 0;
                this.rolling = false;

                this.attemptsHistory.push({
                    attempt: this.attemptsHistory.length + 1,
                    balance: this.balance
                });

                this.message = result.win > 0
                    ? `You won ${result.win.toFixed(2)}!  (${result.name}, x${result.multiplier.toFixed(2)})`
                    : "No win ";
            }, 1600);
        },

        checkCombination(arr, betAmount) {
            const counts = {};
            arr.forEach(d => counts[d] = (counts[d] || 0) + 1);
            const values = Object.values(counts).sort((a, b) => b - a);
            const round2 = (n) => +(n.toFixed(2));

            if (values[0] === 5) {
                const m = this.odds.balut;
                return { name: "Balut", multiplier: round2(m), win: round2(betAmount * m) };
            }

            const uniqSorted = [...new Set(arr)].sort((a, b) => a - b);
            if (uniqSorted.length === 5) {
                const s = uniqSorted.join("");
                if (s === "12345" || s === "23456") {
                    const m = this.odds.straight;
                    return { name: "Straight", multiplier: round2(m), win: round2(betAmount * m) };
                }
            }

            if (values[0] === 3 && values[1] === 2) {
                const m = this.odds.fullHouse;
                return { name: "Full House", multiplier: round2(m), win: round2(betAmount * m) };
            }

            if (values[0] >= 2) {
                const m = this.odds.pair;
                return { name: "Pair", multiplier: round2(m), win: round2(betAmount * m) };
            }

            return { name: "No combo", multiplier: 0, win: 0 };
        },

        // 🔹 новый метод для симуляции RTP
        simulateRTP(rounds = 100000) {
            let simBets = 0;
            let simWins = 0;
            const stats = { Pair: 0, "Full House": 0, Straight: 0, Balut: 0 };

            for (let i = 0; i < rounds; i++) {
                const dice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
                const betAmount = 1;
                const result = this.checkCombination(dice, betAmount);

                simBets += betAmount;
                simWins += result.win;

                if (stats[result.name] !== undefined) stats[result.name]++;
            }

            const rtp = (simWins / simBets) * 100;

            const msg = [
                `Simulated ${rounds.toLocaleString()} rounds.`,
                `RTP ≈ ${rtp.toFixed(2)}%`,
                `Pair: ${(stats["Pair"] / rounds * 100).toFixed(2)}%`,
                `Full House: ${(stats["Full House"] / rounds * 100).toFixed(2)}%`,
                `Straight: ${(stats["Straight"] / rounds * 100).toFixed(2)}%`,
                `Balut: ${(stats["Balut"] / rounds * 100).toFixed(3)}%`
            ].join("\n");

            return msg;
        }
    }
});
