export class MomentumSystem {
  private streakA = 0;
  private streakB = 0;

  public recordRoundWinner(winner: "A" | "B") {
    if (winner === "A") {
      this.streakA++;
      this.streakB = 0;
    } else {
      this.streakB++;
      this.streakA = 0;
    }
  }

  /**
   * Returns the momentum bonus as a probability modifier (e.g. 0.03 for +3%).
   * Max bonus is +5% (0.05).
   */
  public getBonus(): { a: number; b: number } {
    return {
      a: Math.min(0.05, this.streakA * 0.01),
      b: Math.min(0.05, this.streakB * 0.01),
    };
  }

  public getStreakInfo() {
    return {
      streakA: this.streakA,
      streakB: this.streakB,
    };
  }
}
