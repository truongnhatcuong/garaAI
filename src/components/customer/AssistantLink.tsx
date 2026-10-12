"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  customerAssistantHref,
  customerAssistantOpenEvent,
} from "@/lib/customer-assistant-navigation";

export function AssistantLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={customerAssistantHref}
      scroll={false}
      className={className}
      onClick={(event) => {
        if (
          window.location.pathname !== "/" ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        window.dispatchEvent(new Event(customerAssistantOpenEvent));
      }}
    >
      {children}
    </Link>
  );
}
