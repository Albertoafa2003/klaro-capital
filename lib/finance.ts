export type RatePeriod = "monthly" | "annual";

export const toDecimal = (percent: number) => percent / 100;

export function equivalentMonthlyRate(percent: number, period: RatePeriod) {
  const rate = toDecimal(percent);
  if (rate <= -1) throw new Error("A taxa deve ser maior que -100%.");
  return period === "monthly" ? rate : Math.pow(1 + rate, 1 / 12) - 1;
}

export function simpleInterest(principal: number, ratePercent: number, periods: number, contribution = 0) {
  if (principal < 0 || periods < 0 || contribution < 0) throw new Error("Use valores iguais ou maiores que zero.");
  const rate = toDecimal(ratePercent);
  const timeline = Array.from({ length: Math.floor(periods) + 1 }, (_, i) => {
    const contributed = principal + contribution * i;
    const interest = principal * rate * i;
    return { period: i, contributed, interest, balance: contributed + interest };
  });
  const last = timeline.at(-1)!;
  return { interest: last.interest, total: last.balance, contributed: last.contributed, timeline };
}

export function compoundInterest(input: {
  principal: number;
  contribution: number;
  ratePercent: number;
  ratePeriod: RatePeriod;
  months: number;
}) {
  const { principal, contribution, ratePercent, ratePeriod, months } = input;
  if (principal < 0 || contribution < 0 || months < 0) throw new Error("Use valores iguais ou maiores que zero.");
  const monthlyRate = equivalentMonthlyRate(ratePercent, ratePeriod);
  let balance = principal;
  const timeline = [{ period: 0, contributed: principal, interest: 0, balance }];
  for (let month = 1; month <= Math.floor(months); month++) {
    balance = balance * (1 + monthlyRate) + contribution;
    const contributed = principal + contribution * month;
    timeline.push({ period: month, contributed, interest: balance - contributed, balance });
  }
  const contributed = principal + contribution * Math.floor(months);
  return { total: balance, contributed, interest: balance - contributed, monthlyRate, timeline };
}

export function presentValueReal(futureValue: number, years: number, nominalPercent: number, inflationPercent: number) {
  if (futureValue < 0 || years < 0) throw new Error("Valor futuro e prazo não podem ser negativos.");
  const nominal = toDecimal(nominalPercent);
  const inflation = toDecimal(inflationPercent);
  if (nominal <= -1 || inflation <= -1) throw new Error("As taxas devem ser maiores que -100%.");
  const realRate = (1 + nominal) / (1 + inflation) - 1;
  const nominalPresent = futureValue / Math.pow(1 + nominal, years);
  const purchasingPowerPresent = futureValue / Math.pow(1 + inflation, years);
  const realPresent = futureValue / Math.pow(1 + realRate, years);
  return { nominalPresent, purchasingPowerPresent, realPresent, realRate };
}

export function requiredMonthlyContribution(goal: number, initial: number, years: number, annualPercent: number) {
  if (goal <= 0 || initial < 0 || years <= 0) throw new Error("Informe meta e prazo maiores que zero.");
  const months = Math.round(years * 12);
  const r = equivalentMonthlyRate(annualPercent, "annual");
  const futureInitial = initial * Math.pow(1 + r, months);
  if (futureInitial >= goal) return 0;
  if (Math.abs(r) < 1e-12) return (goal - initial) / months;
  return (goal - futureInitial) * r / (Math.pow(1 + r, months) - 1);
}

export function twr(returns: number[]) {
  if (!returns.length) return 0;
  return returns.reduce((acc, value) => acc * (1 + value), 1) - 1;
}

export type CashFlow = { date: string | Date; amount: number };

function xnpv(rate: number, flows: CashFlow[]) {
  const t0 = new Date(flows[0].date).getTime();
  return flows.reduce((sum, flow) => {
    const days = (new Date(flow.date).getTime() - t0) / 86_400_000;
    return sum + flow.amount / Math.pow(1 + rate, days / 365);
  }, 0);
}

export function xirr(flows: CashFlow[], guess = 0.1) {
  if (flows.length < 2 || !flows.some(f => f.amount < 0) || !flows.some(f => f.amount > 0)) {
    throw new Error("A XIRR exige ao menos um fluxo negativo e um positivo.");
  }
  const sorted = [...flows].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  let rate = guess;
  for (let i = 0; i < 50; i++) {
    const value = xnpv(rate, sorted);
    const epsilon = 1e-6;
    const derivative = (xnpv(rate + epsilon, sorted) - value) / epsilon;
    if (!Number.isFinite(derivative) || Math.abs(derivative) < 1e-10) break;
    const next = rate - value / derivative;
    if (next <= -0.999999 || !Number.isFinite(next)) break;
    if (Math.abs(next - rate) < 1e-9) return next;
    rate = next;
  }
  let low = -0.9999;
  let high = 1;
  let lowValue = xnpv(low, sorted);
  let highValue = xnpv(high, sorted);
  for (let i = 0; i < 30 && Math.sign(lowValue) === Math.sign(highValue); i++) {
    high *= 2;
    highValue = xnpv(high, sorted);
  }
  if (Math.sign(lowValue) === Math.sign(highValue)) throw new Error("Não foi encontrada uma solução única para a XIRR.");
  for (let i = 0; i < 150; i++) {
    const mid = (low + high) / 2;
    const value = xnpv(mid, sorted);
    if (Math.abs(value) < 1e-8) return mid;
    if (Math.sign(value) === Math.sign(lowValue)) {
      low = mid;
      lowValue = value;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

export function annualizedReturn(start: number, end: number, years: number) {
  if (start <= 0 || end < 0 || years <= 0) throw new Error("Valores e prazo devem ser válidos.");
  return Math.pow(end / start, 1 / years) - 1;
}

export function realReturn(returnDecimal: number, inflationPercent: number) {
  return (1 + returnDecimal) / (1 + toDecimal(inflationPercent)) - 1;
}
