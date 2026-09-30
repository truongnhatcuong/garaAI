"use client";
import { Printer } from "lucide-react";
export function PrintButton() {
  return <button type="button" onClick={() => window.print()} className="btn btn-soft"><Printer size={15} />In phiếu</button>;
}
