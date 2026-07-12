export interface TradingAccount {
  id: string;
  user_id?: string;
  name: string;
  initial_balance: number;
  currency: string;
  created_at?: string;
}

export interface TradingPlan {
  id: string;
  account_id: string;
  pair: string;
  direction: 'Long' | 'Short';
  setup: string;
  timeframe: string;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  risk_amount?: number;
  session?: string;
  checklist_completed: boolean;
  bias?: string;
  screenshot_url?: string;
  created_at?: string;
}

export interface Trade {
  id: string;
  account_id: string;
  plan_id?: string;
  date: string;
  time: string;
  pair: string;
  direction: 'Long' | 'Short';
  entry_price: number;
  exit_price: number;
  stop_loss: number;
  take_profit: number;
  lot_size: number;
  risk: number;
  profit: number;
  result: 'Win' | 'Loss' | 'Break Even';
  rr: number;
  setup: string;
  session: string;
  tags: string[];
  mood: string;
  
  score_plan_quality?: number;
  score_execution?: number;
  score_risk_management?: number;
  score_discipline?: number;
  score_patience?: number;
  score_emotional_control?: number;
  score_exit_quality?: number;
  score_overall?: number;
  
  ai_summary?: string;
  mistakes?: string[];
  lessons_learned?: string;
  screenshot_url?: string;

  created_at?: string;
}

export interface TradingRule {
  id: string;
  account_id: string;
  rule_type: 'MAX_TRADES_DAY' | 'MAX_RISK_TRADE' | 'ALLOWED_SESSIONS' | 'MAX_DRAWDOWN' | 'NO_NEWS_TRADING';
  rule_value: string;
  is_active: boolean;
  created_at?: string;
}

export interface PropFirmChallenge {
  id: string;
  account_id: string;
  firm_name: string;
  starting_balance: number;
  profit_target: number;
  max_daily_drawdown: number;
  max_total_drawdown: number;
  minimum_days: number;
  status: 'ACTIVE' | 'PASSED' | 'FAILED';
  created_at?: string;
}

export interface DailyMission {
  id: string;
  account_id: string;
  date: string;
  goal_text: string;
  focus_strategy?: string;
  max_trades?: number;
  max_risk?: number;
  ai_motivation?: string;
  is_completed: boolean;
  created_at?: string;
}

export interface MistakeEntry {
  id: string;
  account_id: string;
  mistake_name: string;
  description?: string;
  frequency: number;
  impact_severity: number;
  last_occurrence?: string;
  suggested_fix?: string;
  created_at?: string;
}
