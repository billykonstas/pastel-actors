import React from "react";
import "../../skeleton.css";
export const SkeletonHeader = ({ columns }: { columns: number }) => (
  <tr>
    {/* Actor header cell */}
    <th className="p-2 border w-[300px] border-wesBrown sticky left-0 bg-wesPink z-10">
      <div className="h-5 w-20 mx-auto bg-wesBrown/20 rounded animate-pulse" />
    </th>
    <th className="p-2 border w-[200px] border-wesBrown sticky left-0 bg-wesPink z-10">
      <div className="h-5 w-20 mx-auto bg-wesBrown/20 rounded animate-pulse" />
    </th>

    {/* Header cells */}
    {[...Array(columns)].map((_, i) => (
      <th key={i} className="p-2 border border-wesBrown min-w-[80px] text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-16 bg-wesBrown/20 overflow-hidden relative rounded ">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="w-10 h-7 mt-1 bg-wesBrown/20 rounded animate-pulse" />
        </div>
      </th>
    ))}
  </tr>
);
