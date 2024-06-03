"use client";

import { createContext, useContext, useState } from "react";

// create context
const MessageContext = createContext({

});

// create provider(we want to provide that context to rest of our application)

export function ContextProvider({ children }) {
    //inside here put any global state you want

    const [count, setCount] = useState(0);
    return (
        //{{}} beacuse it takes in object
        //inside value we put all things which we want to access globally
        <MessageContext.Provider value={{
            count, setCount
        }}>
            {children}
        </MessageContext.Provider>
    )
}

// create a custom hook to access contexts
export function useMessageContext() {
    return useContext(MessageContext);
}