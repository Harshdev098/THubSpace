// ProjectContext.js
import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projectTitle, setProjectTitle] = useState("");

  return (
    <ProjectContext.Provider value={{ projectTitle, setProjectTitle }}>
      {children}
    </ProjectContext.Provider>
  );
};
