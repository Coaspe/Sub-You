import { createContext } from "react";
import { getUserType } from "../types";

const UserFirestoreContext = createContext<getUserType>({} as getUserType);

export default UserFirestoreContext;
