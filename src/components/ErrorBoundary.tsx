import React from "react";
type State={hasError:boolean; error?:any};
export default class ErrorBoundary extends React.Component<React.PropsWithChildren,State>{
  state:State={hasError:false};
  static getDerivedStateFromError(error:any){ return {hasError:true,error}; }
  componentDidCatch(error:any, info:any){ console.error("[ECC] crash", error, info); }
  render(){ if(!this.state.hasError) return this.props.children;
    return (<div className="panel" style={{margin:16,padding:16}}>
      <h2>Something broke</h2>
      <pre style={{whiteSpace:"pre-wrap"}}>{String(this.state.error?.message||this.state.error||"Unknown error")}</pre>
    </div>);
  }
}
