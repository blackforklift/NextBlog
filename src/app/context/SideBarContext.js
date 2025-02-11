"use client";

import React, { createContext, useState } from "react";

export const Sidebarcontext = createContext();

export const SidebarStateProvider = ({ children }) => {
  const [sideBar, setSidebar] = useState(false); // Sidebar (TOC) açık mı?

  return (
    <Sidebarcontext.Provider value={{ sideBar, setSidebar }}>
      {children}
    </Sidebarcontext.Provider>
  );
};
