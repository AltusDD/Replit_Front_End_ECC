import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; msg?: string }> {
  constructor(props:any){ super(props); this.state={ hasError:false, msg: undefined }; }
  static getDerivedStateFromError(err: any){ return { hasError:true, msg:String(err?.message||err) }; }
  componentDidCatch(err:any){ console.error("[CardError]", err); }
  render(){
    return this.state.hasError
      ? <div data-testid="contract-error" className="p-3 border border-rose-700 bg-rose-900/30 rounded">
          <div className="font-semibold">Contract violation</div>
          <div className="text-sm opacity-80">{this.state.msg}</div>
        </div>
      : this.props.children;
  }
}

export default ErrorBoundary;