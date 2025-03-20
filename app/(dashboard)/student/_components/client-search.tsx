"use client";

import SearchInput from "@/app/(dashboard)/_components/search-input";
import { Suspense } from "react";

export const SearchWrapper = () => {
  return (
    <div className="px-6 pt-6 md:hidden md:mb-0 block">
      <Suspense fallback={<div className="h-10" />}>
        <SearchInput />
      </Suspense>
    </div>
  );
};
