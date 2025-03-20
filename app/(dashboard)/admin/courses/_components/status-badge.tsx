"use client";

import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "DRAFT":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Draft
        </Badge>
      );
    case "SUBMITTED":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Submitted
        </Badge>
      );
    case "UNDER_REVIEW":
      return (
        <Badge variant="outline" className="flex items-center gap-1 border-orange-500 bg-orange-100 text-orange-700">
          <AlertCircle className="h-3 w-3" /> Under Review
        </Badge>
      );
    case "NEEDS_REVISION":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Needs Revision
        </Badge>
      );
    case "GRADED":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3" /> Graded
        </Badge>
      );
    case "PUBLISHED":
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Published
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
