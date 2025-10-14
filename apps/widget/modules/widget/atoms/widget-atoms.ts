import {atom} from "jotai";
import { WidgetScreen } from "../types";

//basic widget state atom
export const screenAtom = atom<WidgetScreen>("auth");