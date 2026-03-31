export const WALLET_BALANCE_UPDATED_EVENT = "wallet:balance-updated";

export function notifyWalletBalanceUpdated(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(WALLET_BALANCE_UPDATED_EVENT));
}
