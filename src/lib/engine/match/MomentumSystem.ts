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
   * Returns the momentum bonus as a probability modifier (e.g. 0.05 for +5%).
   * Max win streak bonus is +10% (0.10).
   * Also applies a small comeback bonus if a team is on a large losing streak.
   */
  public getBonus(): { a: number; b: number } {
    let bonusA = Math.min(0.10, this.streakA * 0.02);
    let bonusB = Math.min(0.10, this.streakB * 0.02);

    // Comeback bonus (desperation kicks in after 4 losses)
    if (this.streakB >= 4) {
      bonusA += Math.min(0.08, (this.streakB - 3) * 0.02);
    }
    if (this.streakA >= 4) {
      bonusB += Math.min(0.08, (this.streakA - 3) * 0.02);
    }

    return { a: bonusA, b: bonusB };
  }

  public getStreakInfo() {
    return {
      streakA: this.streakA,
      streakB: this.streakB,
    };
  }
}
