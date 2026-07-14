# Fórmulas financeiras

Os cálculos mantêm precisão em ponto flutuante internamente e só formatam valores na interface.

- **Juros simples:** `J = C × i × t` e `M = C + J + aportes`.
- **Taxa equivalente:** `i_m = (1 + i_a)^(1/12) − 1`.
- **Juros compostos:** a cada período, `saldo = saldo anterior × (1 + i) + aporte`.
- **Valor presente:** `VP = VF / (1 + i)^n`.
- **Taxa real de Fisher:** `i_real = (1 + i_nominal) / (1 + inflação) − 1`.
- **Aporte para meta:** fórmula do valor futuro de uma série uniforme postecipada, descontado o capital inicial capitalizado.
- **Retorno anualizado:** `(valor final / valor inicial)^(1/anos) − 1`.
- **TWR:** produto geométrico dos retornos subperiódicos, menos um.
- **XIRR:** taxa anual que zera o valor presente líquido dos fluxos com datas reais. A implementação tenta Newton-Raphson e usa bisseção como alternativa robusta.

Premissas fiscais, inflação, custos e periodicidades devem ser informados pelo usuário. Nenhuma simulação constitui garantia de resultado.
