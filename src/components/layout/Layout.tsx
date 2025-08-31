
import React from "react";
import Sidebar from "../Sidebar";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
return (
<>
<Sidebar />
<main style={{ padding: "24px" }}>{children}</main>
</>
);
};

export default Layout;
