"use client";

export const PACKAGE_EVENT = "vk:package";

/* Picks the package (a package id, or "deda-mraz") in the order wizard below,
   then scrolls to it. */
export function PackageButton({ id, label, className = "btn btn-primary btn-sm w-full" }: { id: string; label: string; className?: string }) {
  return (
    <a href="#naruci" className={className} onClick={() => window.dispatchEvent(new CustomEvent<string>(PACKAGE_EVENT, { detail: id }))}>
      {label}
    </a>
  );
}
