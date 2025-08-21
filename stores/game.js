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
            pair: 2,
            triple: 2.5,
            fullHouse: 3,
            balut: 4,
            straight: 5,
        },
        attemptsHistory: []
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

                const pureWin = result.win;
                const payout = pureWin;

                if (payout > 0) {
                    this.balance = +(this.balance + payout).toFixed(2);
                }

                this.totalWins = +(this.totalWins + pureWin).toFixed(2);

                this.rtp = this.totalBets > 0 ? (this.totalWins / this.totalBets) * 100 : 0;

                this.rolling = false;
                this.attemptsHistory.push({
                    attempt: this.attemptsHistory.length + 1,
                    balance: this.balance
                });

                this.message = pureWin > 0
                  ? `You won ${(payout).toFixed(2)}!  (${result.name}, x${result.multiplier.toFixed(2)})`
                  : "No win ";
            }, 1600);
        },

        checkCombination(arr, betAmount) {
            const counts = {};
            arr.forEach(d => counts[d] = (counts[d] || 0) + 1);
            const values = Object.values(counts).sort((a, b) => b - a);
            const round2 = (n) => +(n.toFixed(2));
            const uniqSorted = [...new Set(arr)].sort((a, b) => a - b);

            if (values[0] === 5) {
                const m = this.odds.balut;
                return { name: "Balut", multiplier: m, win: round2(betAmount * m )};
            }

            if (uniqSorted.length === 5) {
                const s = uniqSorted.join("");
                if (s === "12345" || s === "23456") {
                    const m = this.odds.straight;
                    return { name: "Straight", multiplier: m, win: round2(betAmount * m )};
                }
            }

            if (values[0] === 3 && values[1] === 2) {
                const m = this.odds.fullHouse;
                return { name: "Full House", multiplier: m, win: round2(betAmount * m ) };
            }

            if (values[0] >= 3 ) {
                const m = this.odds.triple;
                return { name: "Triple", multiplier: m, win: round2(betAmount * m ) };
            }

            if (values[0] === 2) {
                const pairsCount = values.filter(v => v === 2).length;
                const m = this.odds.pair;
                return {
                    name: pairsCount === 2 ? "Two Pairs" : "Pair",
                    multiplier: m,
                    win: round2(betAmount * m )
                };
            }

            return { name: "No combo", multiplier: 0, win: 0 };
        },

        simulateRTP(rounds = 100000) {
            let simBets = 0;
            let simWins = 0;
            const stats = { Pair: 0, Triple: 0, "Full House": 0, Straight: 0, Balut: 0 };

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
                `Triple: ${(stats["Triple"] / rounds * 100).toFixed(2)}%`,
                `Full House: ${(stats["Full House"] / rounds * 100).toFixed(2)}%`,
                `Straight: ${(stats["Straight"] / rounds * 100).toFixed(2)}%`,
                `Balut: ${(stats["Balut"] / rounds * 100).toFixed(3)}%`,
            ].join("\n");

            return msg;
        }
    }
});
