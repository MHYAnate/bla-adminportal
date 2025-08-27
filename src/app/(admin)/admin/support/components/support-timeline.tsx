"use client";

import type { TimelineEntry } from "../types/support-types";

interface SupportTimelineProps {
  timeline: TimelineEntry[];
}

const SupportTimeline: React.FC<SupportTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Support Timeline</h3>
      <div className="space-y-3">
        {timeline.map((entry, index) => (
          <div
            key={entry.id || index}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded"
          >
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Status changed from {entry.fromStatus} to {entry.toStatus}
              </p>
              {entry.notes && (
                <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(entry.createdAt).toLocaleString()} by{" "}
                {entry.admin?.adminProfile?.fullName || "System"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTimeline;