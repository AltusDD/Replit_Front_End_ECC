import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Shield, Timer, TrendingUp, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface PingResponse {
  ok: boolean;
  baseUrl?: string;
  authenticated: boolean;
  sampleCount?: number;
  elapsedMs: number;
  error?: string;
  healthScore?: number;
  rateLimit?: {
    limit: number;
    remaining: number;
    resetTime: number;
  };
  circuitBreaker?: {
    isOpen: boolean;
    failures: number;
    cooldownUntil?: number;
  };
  fullResponse?: any;
}

interface CircuitBreakerStatus {
  isOpen: boolean;
  failures: number;
  cooldownUntil?: number;
}

interface RateLimitStatus {
  limit: number;
  remaining: number;
  resetTime: number;
}

interface StatusCardProps {
  title: string;
  status: "healthy" | "degraded" | "failing";
  baseUrl?: string;
  authenticated?: boolean;
  healthScore?: number;
  rateLimit?: RateLimitStatus;
  circuitBreaker?: CircuitBreakerStatus;
  lastSuccess?: string;
  lastError?: string;
  onPing: () => Promise<PingResponse>;
  onResetCircuitBreaker?: () => Promise<void>;
}

const StatusChip = ({ status }: { status: "healthy" | "degraded" | "failing" }) => {
  const config = {
    healthy: { icon: CheckCircle, label: "✅ Healthy", className: "ecc-badge--success" },
    degraded: { icon: AlertTriangle, label: "⚠️ Degraded", className: "ecc-badge--warning" },
    failing: { icon: XCircle, label: "❌ Failing", className: "ecc-badge--error" }
  };
  
  const { icon: Icon, label, className } = config[status];
  return (
    <div className={`ecc-badge ${className}`}>
      <Icon className="w-4 h-4" />
      {label}
    </div>
  );
};

// Utility functions
const formatTimeUntil = (timestamp: number) => {
  const now = Date.now();
  const diff = timestamp - now;
  if (diff <= 0) return "Now";
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

const getHealthScoreColor = (score: number) => {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  return "text-red-500";
};

const getHealthScoreLabel = (score: number) => {
  if (score >= 95) return "Excellent";
  if (score >= 85) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 50) return "Poor";
  return "Critical";
};

export default function StatusCard({ 
  title, 
  status, 
  baseUrl, 
  authenticated, 
  healthScore,
  rateLimit, 
  circuitBreaker,
  lastSuccess, 
  lastError,
  onPing,
  onResetCircuitBreaker
}: StatusCardProps) {
  const [pinging, setPinging] = useState(false);
  const [resettingCircuitBreaker, setResettingCircuitBreaker] = useState(false);
  const [pingResult, setPingResult] = useState<PingResponse | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second for countdown displays
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePing = async () => {
    setPinging(true);
    try {
      const result = await onPing();
      setPingResult(result);
    } catch (err) {
      setPingResult({
        ok: false,
        authenticated: false,
        elapsedMs: 0,
        error: String(err)
      });
    } finally {
      setPinging(false);
    }
  };

  const handleResetCircuitBreaker = async () => {
    if (!onResetCircuitBreaker) return;
    
    setResettingCircuitBreaker(true);
    try {
      await onResetCircuitBreaker();
    } catch (err) {
      console.error('Failed to reset circuit breaker:', err);
    } finally {
      setResettingCircuitBreaker(false);
    }
  };

  return (
    <div className="ecc-card">
      <div className="ecc-card__header">
        <h3 className="ecc-card__title">{title}</h3>
        <StatusChip status={status} />
      </div>
      
      <div className="ecc-card__body">
        <div className="space-y-3">
          <div className="ecc-field-row">
            <span className="ecc-field-label">Base URL:</span>
            <span className="ecc-field-value font-mono text-sm">{baseUrl || 'Not configured'}</span>
          </div>
          
          <div className="ecc-field-row">
            <span className="ecc-field-label">Auth OK:</span>
            <span className={`ecc-badge ${authenticated ? 'ecc-badge--success' : 'ecc-badge--error'}`}>
              {authenticated ? 'Yes' : 'No'}
            </span>
          </div>

          {/* Health Score Display */}
          {healthScore !== undefined && (
            <div className="ecc-field-row">
              <span className="ecc-field-label flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Health Score:</span>
              </span>
              <span className={`ecc-field-value font-mono ${getHealthScoreColor(healthScore)}`}>
                {healthScore.toFixed(1)}% ({getHealthScoreLabel(healthScore)})
              </span>
            </div>
          )}

          {/* Circuit Breaker Status */}
          {circuitBreaker && (
            <div className="ecc-field-row">
              <span className="ecc-field-label flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Circuit Breaker:</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className={`ecc-badge ${circuitBreaker.isOpen ? 'ecc-badge--error' : 'ecc-badge--success'}`}>
                  {circuitBreaker.isOpen ? 'Open' : 'Closed'}
                </span>
                {circuitBreaker.failures > 0 && (
                  <span className="text-sm text-gray-500">
                    {circuitBreaker.failures} failures
                  </span>
                )}
                {circuitBreaker.cooldownUntil && circuitBreaker.cooldownUntil > currentTime && (
                  <span className="text-sm text-yellow-600 font-mono">
                    cooldown: {formatTimeUntil(circuitBreaker.cooldownUntil)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rate Limit Status with Countdown */}
          {rateLimit && (
            <div className="ecc-field-row">
              <span className="ecc-field-label flex items-center space-x-1">
                <Timer className="w-4 h-4" />
                <span>Rate Limit:</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="ecc-field-value font-mono text-sm">
                  {rateLimit.remaining}/{rateLimit.limit}
                </span>
                {rateLimit.resetTime > currentTime && (
                  <span className="text-sm text-gray-500 font-mono">
                    reset: {formatTimeUntil(rateLimit.resetTime)}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {lastSuccess && (
            <div className="ecc-field-row">
              <span className="ecc-field-label">Last Success:</span>
              <span className="ecc-field-value text-sm">{lastSuccess}</span>
            </div>
          )}
          
          {lastError && (
            <div className="ecc-field-row">
              <span className="ecc-field-label">Last Error:</span>
              <span className="ecc-field-value text-sm text-red-400">{lastError}</span>
            </div>
          )}
          
          {/* Enhanced Ping Results */}
          {pingResult && (
            <div className="space-y-2">
              <div className="ecc-field-row">
                <span className="ecc-field-label">Ping Result:</span>
                <span className={`ecc-badge ${pingResult.ok ? 'ecc-badge--success' : 'ecc-badge--error'}`}>
                  {pingResult.ok ? `✓ ${pingResult.elapsedMs}ms` : '✗ Failed'}
                </span>
              </div>
              
              {pingResult.sampleCount && (
                <div className="ecc-field-row">
                  <span className="ecc-field-label">Sample Count:</span>
                  <span className="ecc-field-value font-mono text-sm">{pingResult.sampleCount.toLocaleString()}</span>
                </div>
              )}

              {pingResult.healthScore !== undefined && (
                <div className="ecc-field-row">
                  <span className="ecc-field-label">Ping Health Score:</span>
                  <span className={`ecc-field-value font-mono ${getHealthScoreColor(pingResult.healthScore)}`}>
                    {pingResult.healthScore.toFixed(1)}%
                  </span>
                </div>
              )}

              {pingResult.rateLimit && (
                <div className="ecc-field-row">
                  <span className="ecc-field-label">Rate Limit Response:</span>
                  <span className="ecc-field-value font-mono text-sm">
                    {pingResult.rateLimit.remaining}/{pingResult.rateLimit.limit}
                  </span>
                </div>
              )}

              {pingResult.error && (
                <div className="ecc-field-row">
                  <span className="ecc-field-label">Ping Error:</span>
                  <span className="ecc-field-value text-sm text-red-400">{pingResult.error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="ecc-card__footer">
        <div className="flex space-x-2">
          <button 
            className="ecc-button ecc-button--secondary"
            onClick={handlePing}
            disabled={pinging}
            data-testid="button-ping"
          >
            {pinging ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Pinging...
              </>
            ) : (
              'Ping'
            )}
          </button>
          
          {/* Circuit Breaker Reset Button */}
          {circuitBreaker?.isOpen && onResetCircuitBreaker && (
            <button
              className="ecc-button ecc-button--warning"
              onClick={handleResetCircuitBreaker}
              disabled={resettingCircuitBreaker}
              data-testid="button-reset-circuit-breaker"
            >
              {resettingCircuitBreaker ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Reset Circuit Breaker
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}