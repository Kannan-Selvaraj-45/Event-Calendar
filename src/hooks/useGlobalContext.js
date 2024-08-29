import { useContext } from "react";
import { EventsContext } from "../context/GlobalcontextProvider";

export default function useGlobalContext () {
    return(
        useContext(EventsContext)
    )
}