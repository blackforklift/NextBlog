"use client";

//hold post data for sending it to sidebar or anywhere.
import React, { createContext, useState } from 'react';

export const PostDataContext = createContext();

export const PostDataProvider = ({ children }) => {
    const [postData, setPostData] = useState(null);

    return (
        <PostDataContext.Provider value={{ postData, setPostData }}>
            {children}
        </PostDataContext.Provider>
    );
};
