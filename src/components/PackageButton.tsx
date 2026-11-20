"use client";

import type { PackageId } from "@/config/site";

export const PACKAGE_EVENT = "vk:package";

/* Picks the package in the order form below, then scrolls to it. */
export function PackageButton({ id, label }: { id: PackageId; label: string }) {
  return (
    <a
      href="#naruci"
      className="btn btn-primary btn-sm w-full"
      onClick={() => window.dispatchEvent(new CustomEvent<PackageId>(PACKAGE_EVENT, { detail: id }))}
    >
      {label}
    </a>
  );
}
