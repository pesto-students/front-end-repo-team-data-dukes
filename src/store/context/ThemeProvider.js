import { createContext } from "react";

export const ThemeProvider = createContext();



export const Theme = ["light", "dark", "synthwave", "winter"];

export const getRandomTheme = () =>{
    const randomIndex = Math.floor(Math.random() * Theme.length);
    return Theme[randomIndex];
}
