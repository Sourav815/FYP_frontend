"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import uniqid from "uniqid";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import type { VerificationResponse } from "@/types/verification";

export default function CertificateFormPage() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role: "",
    affiliation: "",
    year: "",
    template: "classic",
  });

  const [qrValue, setQrValue] = useState(
    `${process.env.NEXT_PUBLIC_LINK}/verification`
  );
  const [namePos, setNamePos] = useState({ x: 0, y: 0 });
  const [qrPos, setQrPos] = useState({ x: 5, y: 5 });
  const [idPos, setIdPos] = useState({ x: 5, y: 5 });

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id: `ICNSBT/2025/${uniqid()}`,
    }));
  }, []);

  const templateImages: Record<string, string> = {
    classic: "/certificates/certificate_I.png",
    modern: "/certificates/certificate_II.png",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/verifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              Name: formData.name,
              Role: formData.role,
              Affiliation: formData.affiliation,
              Conference_Name: "ICNSBT",
              Year: formData.year,
              Purpose: "Certificate Verification",
              Certificate_Id: formData.id,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to store data");

      const result = await response.json();
      const storedEntry = result?.data;
      const documentId = storedEntry?.documentId || storedEntry?.id;

      if (!documentId) throw new Error("documentId missing in response");

      // Set qrValue and wait a tick for the QR to update
      const fullLink = `${process.env.NEXT_PUBLIC_LINK}/verification/${documentId}`;
      setQrValue(fullLink);

      // Wait for the QR code to update and render
      setTimeout(async () => {
        if (previewRef.current === null) return;

        const dataUrl = await toPng(previewRef.current, { cacheBust: true });

        const link = document.createElement("a");
        const fileName = `Certificate_${
          formData.name || "user"
        }_${new Date().getFullYear()}.png`;
        link.download = fileName;
        link.href = dataUrl;
        link.click();

        // Reset form
        setFormData({
          id: `ICNSBT/2025/${uniqid()}`,
          name: "",
          role: "",
          affiliation: "",
          year: "",
          template: "classic",
        });
        setNamePos({ x: 0, y: 0 });
        setQrPos({ x: 5, y: 5 });
        setIdPos({ x: 5, y: 5 });
        setQrValue(`${process.env.NEXT_PUBLIC_LINK}/verification`);
      }, 1000); // wait 500ms to allow QR to update
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const downloadCertificate = useCallback(() => {
    if (previewRef.current === null) return;

    toPng(previewRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${formData.name || "certificate"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Failed to download certificate", err);
      });
  }, [formData.name]);

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow h-fit max-w-md m-2">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Certificate Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="id"
                className="block mb-1 font-medium text-sm md:text-base"
              >
                Certificate ID
              </label>
              <input
                id="id"
                name="id"
                value={formData.id}
                disabled
                className="w-full p-2 border rounded bg-gray-100 text-sm md:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block mb-1 font-medium text-sm md:text-base"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm md:text-base"
                required
                placeholder="ex. John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block mb-1 font-medium text-sm md:text-base"
              >
                Role
              </label>
              <input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm md:text-base"
                required
                placeholder="ex. Organizer"
              />
            </div>

            <div>
              <label
                htmlFor="affiliation"
                className="block mb-1 font-medium text-sm md:text-base"
              >
                Affiliation
              </label>
              <input
                id="affiliation"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm md:text-base"
                required
                placeholder="ex. Jalpaiguri Govt. Engineering College"
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className="block mb-1 font-medium text-sm md:text-base"
              >
                Year
              </label>
              <input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm md:text-base"
                required
                placeholder="ex. 2025"
              />
            </div>

            <div>
              <label
                htmlFor="template"
                className="block mb-1 font-medium text-sm md:text-base"
              >
                Select Template
              </label>
              <select
                id="template"
                name="template"
                value={formData.template}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm md:text-base"
                required
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="elegant">Elegant</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>

            {/* Sliders in rows */}
            <div className="space-y-4 mt-4">
              <h3 className="font-semibold text-lg">Adjust Positions</h3>

              {/* Name Position */}
              <div>
                <label className="font-medium text-sm md:text-base mb-1 block">
                  Name Position
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={-200}
                    max={200}
                    value={namePos.x}
                    onChange={(e) =>
                      setNamePos((pos) => ({
                        ...pos,
                        x: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={-200}
                    max={200}
                    value={namePos.y}
                    onChange={(e) =>
                      setNamePos((pos) => ({
                        ...pos,
                        y: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* QR Code Position */}
              <div>
                <label className="font-medium text-sm md:text-base mb-1 block">
                  QR Code Position
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={-200}
                    max={200}
                    value={qrPos.x}
                    onChange={(e) =>
                      setQrPos((pos) => ({ ...pos, x: Number(e.target.value) }))
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={-200}
                    max={200}
                    value={qrPos.y}
                    onChange={(e) =>
                      setQrPos((pos) => ({ ...pos, y: Number(e.target.value) }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Certificate ID Position */}
              <div>
                <label className="font-medium text-sm md:text-base mb-1 block">
                  Certificate ID Position
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={-200}
                    max={200}
                    value={idPos.x}
                    onChange={(e) =>
                      setIdPos((pos) => ({ ...pos, x: Number(e.target.value) }))
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={-200}
                    max={200}
                    value={idPos.y}
                    onChange={(e) =>
                      setIdPos((pos) => ({ ...pos, y: Number(e.target.value) }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-base md:text-lg mt-4"
            >
              Download Certificate
            </button>
          </form>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow text-center flex flex-col items-center justify-start max-w-4xl m-2">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Certificate Preview
          </h2>

          <div
            ref={previewRef}
            className="relative w-full aspect-video max-h-[36rem] md:max-h-[42rem] border border-dashed border-gray-400 rounded-lg overflow-hidden bg-gray-50"
          >
            <img
              src={templateImages[formData.template]}
              alt={`${formData.template} template`}
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />

            <div className="relative z-10 h-full px-4 text-gray-800 flex flex-col justify-between items-center py-6">
              <div
                className="flex-1 flex items-center justify-center mt-28"
                style={{
                  transform: `translate(${namePos.x}px, ${namePos.y}px)`,
                }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-center break-words max-w-full">
                  {formData.name || "Full Name"}
                </h3>
              </div>

              <div
                className="flex flex-col items-center space-y-2 mb-2"
                style={{ transform: `translate(${qrPos.x}px, ${qrPos.y}px)` }}
              >
                <QRCodeSVG value={qrValue} size={70} />
              </div>

              <div
                className="text-xs md:text-sm text-gray-600 break-all max-w-full mb-6"
                style={{ transform: `translate(${idPos.x}px, ${idPos.y}px)` }}
              >
                Certificate ID: {formData.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
