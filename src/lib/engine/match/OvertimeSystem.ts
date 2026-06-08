export class OvertimeSystem {
  public checkMatchWinner(scoreA: number, scoreB: number): "A" | "B" | null {
    if (scoreA < 13 && scoreB < 13) return null;

    if (scoreA === 12 && scoreB === 12) {
      // Transition to Overtime. In OT, must win by 2.
      // E.g. 14-12, 15-13, etc.
      return null;
    }

    // Standard win or Win by 2 in OT
    if (scoreA >= 13 && scoreA - scoreB >= 2) return "A";
    if (scoreB >= 13 && scoreB - scoreA >= 2) return "B";

    return null; // Keep playing
  }

  public isOvertime(scoreA: number, scoreB: number): boolean {
    return scoreA >= 12 && scoreB >= 12;
  }
}
