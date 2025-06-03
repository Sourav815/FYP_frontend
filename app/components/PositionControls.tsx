// components/PositionControls.tsx
import React from "react";

export default function PositionControls({ positions, setPositions }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-4">Position controls</h3>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {Object.keys(positions).map((key) => (
          <div key={key} className="mb-4">
            <label className="font-medium text-sm md:text-base mb-1 block capitalize">
              {key} position
            </label>
            <div className="flex gap-2 items-center">
              <span className="text-xs w-6">X:</span>
              <input
                type="range"
                min="-200"
                max="200"
                value={positions[key]?.x || 0}
                onChange={(e) =>
                  setPositions((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], x: Number(e.target.value) },
                  }))
                }
                className="w-full"
              />
              <span className="text-xs w-8 text-right">{positions[key]?.x || 0}</span>
            </div>
            <div className="flex gap-2 items-center mt-1">
              <span className="text-xs w-6">Y:</span>
              <input
                type="range"
                min="-200"
                max="1000"
                value={positions[key]?.y || 0}
                onChange={(e) =>
                  setPositions((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], y: Number(e.target.value) },
                  }))
                }
                className="w-full"
              />
              <span className="text-xs w-8 text-right">{positions[key]?.y || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}