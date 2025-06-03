"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import uniqid from "uniqid";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

export default function CertificateFormPage() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role: "",
    affiliation: "",
    year: "",
    designation: "",
    conferenceName: "",
    conferenceVenue: "",
    date: "",
    template: "classic",
  });
  const [qrValue, setQrValue] = useState(
    `${process.env.NEXT_PUBLIC_LINK}/verification`
  );
  const [namePos, setNamePos] = useState({ x: 0, y: 20 });
  const [rolePos, setRolePos] = useState({ x: 0, y: 80 });
  const [affiliationPos, setAffiliationPos] = useState({ x: 0, y: 120 });
  const [qrPos, setQrPos] = useState({ x: 0, y: 200 });
  const [idPos, setIdPos] = useState({ x: 0, y: 280 });
  const [conferencePos, setConferencePos] = useState({ x: 0, y: 320 });
  const [venuePos, setVenuePos] = useState({ x: 0, y: 360 });
  const [datePos, setDatePos] = useState({ x: 0, y: 400 });

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id: `ICNSBT/2025/${uniqid()}`,
    }));
  }, []);

  const templateImages: Record<string, string> = {
    classic: "/ids/IDI.png",
    modern: "/ids/IDII.png",
    minimalist: "/ids/IDIII.png",
    elegant: "/ids/IDIV.png",
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
              Conference_Name: formData.conferenceName,
              Year: formData.year,
              Purpose: "Identity Verification",
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

      const fullLink = `${process.env.NEXT_PUBLIC_LINK}/verification/${documentId}`;
      setQrValue(fullLink);

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

        setFormData({
          id: `ICNSBT/2025/${uniqid()}`,
          name: "",
          role: "",
          affiliation: "",
          year: "",
          designation: "",
          conferenceName: "",
          conferenceVenue: "",
          date: "",
          template: "classic",
        });

        setNamePos({ x: 0, y: 20 });
        setRolePos({ x: 0, y: 80 });
        setAffiliationPos({ x: 0, y: 120 });
        setQrPos({ x: 0, y: 200 });
        setIdPos({ x: 0, y: 280 });
        setConferencePos({ x: 0, y: 320 });
        setVenuePos({ x: 0, y: 360 });
        setDatePos({ x: 0, y: 400 });

        setQrValue(`${process.env.NEXT_PUBLIC_LINK}/verification`);
      }, 1000);
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
      .catch((err) => console.error("Failed to download certificate", err));
  }, [formData.name]);

  const roleStyles: Record<string, { bgColor: string; textColor: string }> = {
    Presenter: { bgColor: "#001F3F", textColor: "#FFFFFF" }, // Dark Blue background, white text
    Delegate: { bgColor: "#FF4136", textColor: "#FFFFFF" }, // Red background, white text
    Organizer: { bgColor: "#2ECC40", textColor: "#003300" }, // Bright Green background, dark green text
    "Session Chair": { bgColor: "#B10DC9", textColor: "#FFFFFF" }, // Purple background, white text
    "Keynote Speaker": { bgColor: "#FFDC00", textColor: "#111111" }, // Bright Yellow background, dark text
    default: { bgColor: "transparent", textColor: "#000000" },
  };

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow h-fit m-2">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            ID Card Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {/* Full Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-1 font-medium text-sm md:text-base"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm md:text-base"
                  required
                  placeholder="ex. John Doe"
                />
              </div>

              {/* Role Dropdown */}
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="block mb-1 font-medium text-sm md:text-base"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm md:text-base"
                  required
                >
                  <option value="">Select a role</option>
                  <option value="Presenter">Presenter</option>
                  <option value="Delegate">Delegate</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Session Chair">Session Chair</option>
                  <option value="Keynote Speaker">Keynote Speaker</option>
                </select>
              </div>

              {/* Remaining Inputs */}
              {[
                {
                  id: "affiliation",
                  label: "Affiliation",
                  placeholder: "ex. Jalpaiguri Govt. Engineering College",
                },
                {
                  id: "conferenceName",
                  label: "Conference Name",
                  placeholder: "ex. ICNSBT 2025",
                },
                {
                  id: "conferenceVenue",
                  label: "Conference Venue",
                  placeholder: "ex. JGEC Campus",
                },
                {
                  id: "date",
                  label: "Date",
                  placeholder: "ex. 10 July 2025",
                },
                { id: "year", label: "Year", placeholder: "ex. 2025" },
              ].map(({ id, label, placeholder }) => (
                <div key={id} className="mb-4">
                  <label
                    htmlFor={id}
                    className="block mb-1 font-medium text-sm md:text-base"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type="text"
                    value={(formData as any)[id]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm md:text-base"
                    required
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            {/* Template Selection */}
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

            {/* Position Controls */}
            <div className="space-y-4 mt-4 max-h-[300px] overflow-y-auto pr-2">
              <h3 className="font-semibold text-lg sticky top-0 bg-white py-2">
                Adjust Positions
              </h3>

              {[
                ["Name", namePos, setNamePos],
                ["Role", rolePos, setRolePos],
                ["Affiliation", affiliationPos, setAffiliationPos],
                ["QR Code", qrPos, setQrPos],
                ["Certificate ID", idPos, setIdPos],
                ["Conference Name", conferencePos, setConferencePos],
                ["Conference Venue", venuePos, setVenuePos],
                ["Conference Date", datePos, setDatePos],
              ].map(([label, pos, setPos]: any) => (
                <div key={label} className="mb-4">
                  <label className="font-medium text-sm md:text-base mb-1 block">
                    {label} Position
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min={-200}
                      max={200}
                      value={pos.x}
                      onChange={(e) =>
                        setPos((p: any) => ({
                          ...p,
                          x: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min={-200}
                      max={1000}
                      value={pos.y}
                      onChange={(e) =>
                        setPos((p: any) => ({
                          ...p,
                          y: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-base md:text-lg mt-4"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Preview */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow text-center flex flex-col items-center justify-start m-2">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            ID Card Preview
          </h2>

          <div
            ref={previewRef}
            className="relative w-full aspect-[3/4] h-[600px] max-h-[80vh] border border-dashed border-gray-400 rounded-lg overflow-hidden bg-gray-50"
          >
            <Image
              src={templateImages[formData.template]}
              alt={`${formData.template} template`}
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
              width={1000}
              height={1000}
            />

            <div className="relative z-10 h-full px-4 text-gray-800 flex flex-col items-center">
              <div
                className="absolute text-center w-full"
                style={{
                  transform: `translate(${namePos.x}px, ${namePos.y}px)`,
                }}
              >
                <h3 className="text-2xl md:text-3xl font-bold break-words max-w-full">
                  {formData.name || "Full Name"}
                </h3>
              </div>

              <div
                className="absolute text-center max-w-fit rounded-full px-20 py-1"
                style={{
                  transform: `translate(${rolePos.x}px, ${rolePos.y}px)`,
                  backgroundColor:
                    roleStyles[formData.role]?.bgColor ||
                    roleStyles.default.bgColor,
                  color:
                    roleStyles[formData.role]?.textColor ||
                    roleStyles.default.textColor,
                }}
              >
                <p className="text-xl md:text-2xl font-semibold">
                  {formData.role || "Role"}
                </p>
              </div>

              <div
                className="absolute text-center w-full"
                style={{
                  transform: `translate(${affiliationPos.x}px, ${affiliationPos.y}px)`,
                }}
              >
                <p className="text-base md:text-lg">
                  {formData.affiliation || "Affiliation"}
                </p>
              </div>

              <div
                className="absolute flex flex-col items-center"
                style={{ transform: `translate(${qrPos.x}px, ${qrPos.y}px)` }}
              >
                <QRCodeSVG value={qrValue} size={80} />
              </div>

              <div
                className="absolute text-center w-full"
                style={{
                  transform: `translate(${idPos.x}px, ${idPos.y}px)`,
                }}
              >
                <p className="text-xs md:text-sm text-gray-600">
                  ID: {formData.id}
                </p>
              </div>

              <div
                className="absolute text-center w-full"
                style={{
                  transform: `translate(${conferencePos.x}px, ${conferencePos.y}px)`,
                }}
              >
                <p className="text-lg md:text-xl font-medium">
                  {formData.conferenceName || "Conference Name"}
                </p>
              </div>

              <div
                className="absolute text-center w-full"
                style={{
                  transform: `translate(${venuePos.x}px, ${venuePos.y}px)`,
                }}
              >
                <p className="text-base md:text-lg">
                  {formData.conferenceVenue || "Conference Venue"}
                </p>
              </div>

              <div
                className="absolute text-center w-full"
                style={{
                  transform: `translate(${datePos.x}px, ${datePos.y}px)`,
                }}
              >
                <p className="text-base md:text-lg">
                  {formData.date || "Conference Date"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={downloadCertificate}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition text-base md:text-lg"
          >
            Download ID Card
          </button>
        </div>
      </div>
    </div>
  );
}
