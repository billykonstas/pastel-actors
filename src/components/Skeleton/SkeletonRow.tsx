import React from "react";
import "../../skeleton.css";

export const SkeletonRow = ({ columns }: { columns: number }) => (
  <tr>
    <td className="p-2 border border-wesBrown sticky left-0 bg-wesYellow z-10">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full shimmer bg-wesBrown/20" />
        <div className="h-4 w-24 bg-wesBrown/20 rounded animate-pulse" />
      </div>
    </td>
    <td className="p-2 border border-wesBrown sticky left-0 bg-wesYellow z-10">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-24 bg-wesBrown/20 rounded animate-pulse" />
      </div>
    </td>
    {/* Movie columns */}
    {[...Array(columns)].map((_, i) => (
      <td key={i} className="p-2 border border-wesBrown text-center">
        <div className="w-8 h-8 rounded-full shimmer bg-wesBrown/20 mx-auto" />
      </td>
    ))}
  </tr>
);
