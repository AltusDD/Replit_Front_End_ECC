import Nav from "./Nav";
import React, { useState, useEffect } from "react";

export default function Layout({children}:{children:React.ReactNode}){
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('ecc.sidebarPinned');
    if (saved !== null) {
      setCollapsed(!JSON.parse(saved));
    }
    
    // Listen for storage changes to sync collapsed state
    const handleStorageChange = () => {
      const saved = localStorage.getItem('ecc.sidebarPinned');
      if (saved !== null) {
        setCollapsed(!JSON.parse(saved));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab updates
    const handlePinChange = (e: CustomEvent) => {
      setCollapsed(!e.detail.pinned);
    };
    
    window.addEventListener('ecc:pinChanged', handlePinChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ecc:pinChanged', handlePinChange as EventListener);
    };
  }, []);
  
  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
      <Nav />
      <main className="main">
        {children}
      </main>
    </div>
  );
}