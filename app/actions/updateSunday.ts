"use server"

import { db } from "../firebase/config"
import { doc, setDoc } from "firebase/firestore"

interface UpdateSundayParams {
    date: string;
    status?: "closed" | "event";
    message?: string;
    messageColor?: string;
}

export async function updateSunday({ date, status, message, messageColor }: UpdateSundayParams) {
  try {
    const sundayRef = doc(db, "sundays", date)
    await setDoc(sundayRef, { status, message, messageColor })
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update Sunday information" }
  }
}

