// Strategy Pattern - Freight calculation strategies

export class SedexStrategy {
  calcular() {
    return 25.90; // Fixed rate for SEDEX
  }
}

export class PACStrategy {
  calcular() {
    return 12.90; // Fixed rate for PAC
  }
}

export class RetiradaStrategy {
  calcular() {
    return 0; // Free in-store pickup
  }
}

export class FreteContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  calcular() {
    return this.strategy.calcular();
  }
}