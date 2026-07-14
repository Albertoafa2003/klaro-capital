import test from "node:test";
import assert from "node:assert/strict";
import { annualizedReturn, compoundInterest, equivalentMonthlyRate, presentValueReal, requiredMonthlyContribution, simpleInterest, twr, xirr } from "../lib/finance";

test("converte taxa anual para mensal equivalente", () => {
  assert.ok(Math.abs(equivalentMonthlyRate(12, "annual") - 0.0094887929) < 1e-8);
});

test("juros simples sem arredondamento prematuro", () => {
  const result = simpleInterest(1000, 2, 10);
  assert.equal(result.interest, 200);
  assert.equal(result.total, 1200);
});

test("juros compostos com aporte mensal", () => {
  const result = compoundInterest({ principal: 1000, contribution: 100, ratePercent: 1, ratePeriod: "monthly", months: 2 });
  assert.ok(Math.abs(result.total - 1221.1) < 1e-9);
});

test("taxa real usa fórmula de Fisher e aceita inflação superior", () => {
  const result = presentValueReal(10000, 5, 3, 6);
  assert.ok(result.realRate < 0);
  assert.ok(Math.abs(result.realRate - ((1.03 / 1.06) - 1)) < 1e-12);
});

test("aporte necessário com taxa zero", () => {
  assert.equal(requiredMonthlyContribution(12000, 0, 1, 0), 1000);
});

test("TWR encadeia retornos subperiódicos", () => {
  assert.ok(Math.abs(twr([.1, -.05]) - .045) < 1e-12);
});

test("XIRR encontra retorno anual de fluxo simples", () => {
  const rate = xirr([{ date: "2025-01-01", amount: -1000 }, { date: "2026-01-01", amount: 1100 }]);
  assert.ok(Math.abs(rate - .1) < 1e-7);
});

test("XIRR rejeita fluxos sem troca de sinal", () => {
  assert.throws(() => xirr([{ date: "2025-01-01", amount: 100 }, { date: "2026-01-01", amount: 200 }]));
});

test("retorno anualizado suporta prazos longos", () => {
  assert.ok(Number.isFinite(annualizedReturn(100, 1000, 40)));
});
