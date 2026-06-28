"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { insforge } from "@/lib/insforge";

export interface TradingAccount {
  id: string;
  name: string;
  initial_balance: number;
  currency: string;
}

interface AccountContextType {
  accounts: TradingAccount[];
  activeAccount: TradingAccount | null;
  setActiveAccount: (account: TradingAccount | null) => void;
  loading: boolean;
  refreshAccounts: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType>({
  accounts: [],
  activeAccount: null,
  setActiveAccount: () => {},
  loading: true,
  refreshAccounts: async () => {},
});

export const useAccount = () => useContext(AccountContext);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<TradingAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await insforge.database
      .from("trading_accounts")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setAccounts(data);
      if (data.length > 0 && !activeAccount) {
        // Default to the first account if none is selected
        setActiveAccount(data[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        activeAccount,
        setActiveAccount,
        loading,
        refreshAccounts: fetchAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
