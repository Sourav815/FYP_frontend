"use client";

import React, { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
import uniqid from "uniqid"; // Import uniqid

import IDCardPreview from "@/app/components/IDCardPreview";
import PositionControls from "@/app/components/PositionControls";

const templateImages = {
  classic: "/ids/IDI.png",
  modern: "/ids/IDII.png",
  milnimalist: "/ids/IDIII.png",
  milnimalist2: "/ids/IDIV.png",
};

// Role styles with background and text colors
const roleStyles = {
  Presenter: { bgColor: "#001F3F", textColor: "#FFFFFF" }, // Dark Blue background, white text
  Volunteer: { bgColor: "#001F3F", textColor: "#FFFFFF" }, // Dark Blue background, white text
  Delegate: { bgColor: "#FF4136", textColor: "#FFFFFF" }, // Red background, white text
  Organizer: { bgColor: "#2ECC40", textColor: "#003300" }, // Bright Green background, dark green text
  "Session Chair": { bgColor: "#B10DC9", textColor: "#FFFFFF" }, // Purple background, white text
  "Keynote Speaker": { bgColor: "#FFDC00", textColor: "#111111" }, // Bright Yellow background, dark text
  default: { bgColor: "#6c757d", textColor: "#FFFFFF" }, // Default gray
};

export default function BulkIDCardGenerator() {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [template, setTemplate] = useState("classic");
  const [formData, setFormData] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const [positions, setPositions] = useState({
    name: { x: 20, y: 30 },
    role: { x: 20, y: 60 },
    affiliation: { x: 20, y: 100 },
    conferenceName: { x: 20, y: 140 },
    conferenceVenue: { x: 20, y: 180 },
    date: { x: 20, y: 220 },
    qr: { x: 130, y: 260 },
    id: { x: 20, y: 300 },
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (Array.isArray(jsonData) && jsonData.length > 0) {
      console.log("Excel data loaded:", jsonData);

      // Process the data to ensure consistent property names
      const processedData = jsonData.map((row) => {
        // Create a standardized object with lowercase keys
        return {
          name: row.Name || row.name || "",
          role: row.Role || row.role || "",
          affiliation: row.Affiliation || row.affiliation || "",
          conferenceName:
            row.ConferenceName ||
            row["Conference Name"] ||
            row.conferenceName ||
            "",
          conferenceVenue:
            row.ConferenceVenue ||
            row["Conference Venue"] ||
            row.conferenceVenue ||
            "",
          date: row.Date || row.date || "",
          year: row.Year || row.year || "",
          // Generate a unique ID for each record
          id: row.ID || row.Id || row.id || `ICNSBT/2025/${uniqid()}`,
        };
      });

      console.log("Processed data:", processedData);
      setExcelData(processedData);
      setFormData(processedData[0]);
      setCurrentIndex(0);
    } else {
      alert("No data found in the Excel file or invalid format");
    }
  };

  // Add this useEffect to ensure formData updates are applied
  useEffect(() => {
    if (currentIndex >= 0 && excelData.length > 0) {
      console.log("Setting form data for index:", currentIndex);
      console.log("Data:", excelData[currentIndex]);
      setFormData({ ...excelData[currentIndex] });
    }
  }, [currentIndex, excelData]);

  const generateAllCards = async () => {
    if (excelData.length === 0) {
      alert("Please upload an Excel file first");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const zip = new JSZip();

      for (let i = 0; i < excelData.length; i++) {
        // Update progress
        setProgress(Math.round((i / excelData.length) * 100));

        // Set current data for rendering
        setCurrentIndex(i);
        const currentData = excelData[i];
        console.log(`Processing record ${i + 1}:`, currentData);
        setFormData(currentData);

        // Wait for the UI to update - increased timeout for better reliability
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Capture the card
        const cardElement = document.getElementById("card-preview");
        if (!cardElement) {
          console.error("Preview element not found");
          continue; // Skip this card but continue with others
        }

        try {
          // Enhanced toPng configuration for better quality
          const dataUrl = await toPng(cardElement, {
            cacheBust: true,
            pixelRatio: 3, // Increased from 2 to 3 for higher resolution
            quality: 1.0,
            skipAutoScale: true,
            canvasWidth: cardElement.offsetWidth * 3, // Match pixelRatio
            canvasHeight: cardElement.offsetHeight * 3, // Match pixelRatio
            style: {
              // Ensure proper rendering of box shadows and borders
              boxShadow: "none",
              border: "none",
            },
            filter: (node) => {
              // Filter out any problematic elements that might cause issues
              const exclusionClasses = ["no-export", "hidden-print"];
              return !exclusionClasses.some((className) =>
                node.classList?.contains(className)
              );
            },
          });

          // Convert data URL to blob with proper error handling
          try {
            const response = await fetch(dataUrl);
            if (!response.ok) throw new Error("Failed to process image data");

            const blob = await response.blob();

            // Add to zip with a more descriptive filename
            const fileName = `${
              currentData.name || `id-card-${i + 1}`
            }.png`.replace(/[^a-z0-9.]/gi, "_");

            zip.file(fileName, blob);
            console.log(`Successfully added ${fileName} to zip`);
          } catch (blobError) {
            console.error(
              `Error processing image data for card ${i + 1}:`,
              blobError
            );
            continue;
          }
        } catch (captureError) {
          console.error(`Error capturing card ${i + 1}:`, captureError);

          // Try again with a simpler configuration if the first attempt failed
          try {
            console.log("Retrying with simpler configuration...");
            const simpleDataUrl = await toPng(cardElement, {
              cacheBust: true,
              pixelRatio: 2,
            });

            const response = await fetch(simpleDataUrl);
            const blob = await response.blob();

            const fileName = `${
              currentData.name || `id-card-${i + 1}`
            }_retry.png`.replace(/[^a-z0-9.]/gi, "_");

            zip.file(fileName, blob);
            console.log(`Successfully added ${fileName} to zip (retry)`);
          } catch (retryError) {
            console.error(`Retry also failed for card ${i + 1}:`, retryError);
            continue;
          }
        }
      }

      // Check if any files were added to the zip
      if (Object.keys(zip.files).length === 0) {
        throw new Error(
          "No cards could be generated. Check console for details."
        );
      }

      // Generate and download the zip
      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE", // Add compression for smaller file size
        compressionOptions: {
          level: 6, // Balanced between size and speed (1-9)
        },
      });

      saveAs(content, "id-cards.zip");
      console.log(
        "ZIP file generated successfully with",
        Object.keys(zip.files).length,
        "cards"
      );
    } catch (error) {
      console.error("Error generating cards:", error);
      alert(
        "An error occurred while generating cards. Check console for details."
      );
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  // Navigation functions
  const goToNext = () => {
    if (currentIndex < excelData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFormData(excelData[currentIndex + 1]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFormData(excelData[currentIndex - 1]);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleExcelUpload}
          disabled={isGenerating}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="border px-4 py-2 rounded"
          disabled={isGenerating}
        >
          {Object.keys(templateImages).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)} template
            </option>
          ))}
        </select>

        <button
          onClick={generateAllCards}
          className={`px-4 py-2 rounded shadow ${
            isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={isGenerating || excelData.length === 0}
        >
          {isGenerating ? `Generating... ${progress}%` : "Generate zip"}
        </button>
      </div>

      {/* Debug display */}
      {formData && Object.keys(formData).length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <details>
            <summary className="cursor-pointer font-medium">
              Current data (click to expand)
            </summary>
            <div className="mt-2 text-xs overflow-auto max-h-40 bg-white p-2 rounded">
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}

      {excelData.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">
            Showing card {currentIndex + 1} of {excelData.length}
          </span>

          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0 || isGenerating}
              className={`px-3 py-1 rounded ${
                currentIndex === 0 || isGenerating
                  ? "bg-gray-200 text-gray-500"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Previous
            </button>

            <button
              onClick={goToNext}
              disabled={currentIndex === excelData.length - 1 || isGenerating}
              className={`px-3 py-1 rounded ${
                currentIndex === excelData.length - 1 || isGenerating
                  ? "bg-gray-200 text-gray-500"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {formData && Object.keys(formData).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <IDCardPreview
              template={template}
              formData={formData}
              positions={positions}
              templateImages={templateImages}
              roleStyles={roleStyles}
            />
          </div>
          <PositionControls positions={positions} setPositions={setPositions} />
        </div>
      )}
    </div>
  );
}
