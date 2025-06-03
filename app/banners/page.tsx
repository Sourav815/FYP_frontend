"use client";
import React, { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";

export default function BannerFormPage() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    template: "classic",
    organizedBy: "",
  });

  const [logo, setLogo] = useState<string | null>(null);
  const [sponsorLogos, setSponsorLogos] = useState<string[]>([]);

  const [titlePos, setTitlePos] = useState({ x: 0, y: 0 });
  const [subtitlePos, setSubtitlePos] = useState({ x: 0, y: 0 });
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  // Added organizedBy position state
  const [organizedByPos, setOrganizedByPos] = useState({ x: 0, y: 0 });

  const previewRef = useRef<HTMLDivElement>(null);

  const templateImages: Record<string, string> = {
    classic: "/banners/PosterI.png",
    modern: "/banners/PosterII.png",
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSponsorLogosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newLogos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            newLogos.push(reader.result);
            if (newLogos.length === files.length) {
              setSponsorLogos((prev) => [...prev, ...newLogos]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const downloadBanner = useCallback(() => {
    if (!previewRef.current) return;
    toPng(previewRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${formData.title || "banner"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Download failed", err));
  }, [formData.title]);

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow h-fit max-w-md m-2">
          <h2 className="text-3xl font-bold mb-6 text-center">Banner Form</h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 overflow-y-auto max-h-[80vh]"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full"
            />

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Banner Title"
              className="w-full p-2 border rounded"
            />

            <input
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Subtitle"
              className="w-full p-2 border rounded"
            />

            <textarea
              name="organizedBy"
              value={formData.organizedBy}
              onChange={handleChange}
              placeholder="Organized By"
              className="w-full p-2 border rounded h-20"
            />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleSponsorLogosUpload}
              className="block w-full"
            />
            <div className="max-h-32 overflow-y-auto border rounded p-2">
              <p className="font-semibold mb-1">Sponsor Logos</p>
              <div className="flex flex-wrap gap-2">
                {sponsorLogos.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    className="w-12 h-12 object-contain"
                    alt={`Sponsor ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <select
              name="template"
              value={formData.template}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>

            {/* Position Sliders */}
            <div>
              <label className="font-semibold">Title Position</label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={-300}
                  max={300}
                  value={titlePos.x}
                  onChange={(e) =>
                    setTitlePos((pos) => ({ ...pos, x: +e.target.value }))
                  }
                />
                <input
                  type="range"
                  min={-300}
                  max={300}
                  value={titlePos.y}
                  onChange={(e) =>
                    setTitlePos((pos) => ({ ...pos, y: +e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="font-semibold">Subtitle Position</label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={-300}
                  max={300}
                  value={subtitlePos.x}
                  onChange={(e) =>
                    setSubtitlePos((pos) => ({ ...pos, x: +e.target.value }))
                  }
                />
                <input
                  type="range"
                  min={-300}
                  max={300}
                  value={subtitlePos.y}
                  onChange={(e) =>
                    setSubtitlePos((pos) => ({ ...pos, y: +e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="font-semibold">Logo Position</label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={-300}
                  max={300}
                  value={logoPos.x}
                  onChange={(e) =>
                    setLogoPos((pos) => ({ ...pos, x: +e.target.value }))
                  }
                />
                <input
                  type="range"
                  min={-300}
                  max={300}
                  value={logoPos.y}
                  onChange={(e) =>
                    setLogoPos((pos) => ({ ...pos, y: +e.target.value }))
                  }
                />
              </div>
            </div>

            {/* New sliders for Organized By position */}
            <div>
              <label className="font-semibold">Organized By Position</label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={-300}
                  max={300}
                  value={organizedByPos.x}
                  onChange={(e) =>
                    setOrganizedByPos((pos) => ({ ...pos, x: +e.target.value }))
                  }
                />
                <input
                  type="range"
                  min={-300}
                  max={300}
                  value={organizedByPos.y}
                  onChange={(e) =>
                    setOrganizedByPos((pos) => ({ ...pos, y: +e.target.value }))
                  }
                />
              </div>
            </div>

            <button
              onClick={downloadBanner}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Download Banner
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow text-center flex flex-col items-center max-w-4xl m-2 text-white">
          <h2 className="text-2xl font-bold mb-6">Banner Preview</h2>
          <div
            ref={previewRef}
            className="relative w-full aspect-[16/9] max-h-[500px] border border-dashed border-gray-400 bg-gray-50 overflow-hidden"
          >
            <img
              src={templateImages[formData.template]}
              alt="Template"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {logo && (
              <img
                src={logo}
                alt="Logo"
                className="absolute w-20 h-20 object-contain"
                style={{
                  top: `1rem`,
                  left: "50%",
                  transform: `translate(-50%, 0) translate(${logoPos.x}px, ${logoPos.y}px)`,
                }}
              />
            )}

            <h1
              className="absolute text-3xl font-bold text-center w-full p-4"
              style={{
                transform: `translate(${titlePos.x}px, ${titlePos.y}px)`,
                top: "40%",
              }}
            >
              {formData.title || "Banner Title"}
            </h1>

            <h2
              className="absolute text-xl font-bold font-sans text-gray-700 w-full text-center bg-amber-200 max-w-xl rounded p-2"
              style={{
                transform: `translate(${subtitlePos.x}px, ${subtitlePos.y}px)`,
                top: "50%",
              }}
            >
              {formData.subtitle || "Subtitle Goes Here"}
            </h2>

            {formData.organizedBy && (
              <div
                className="absolute w-full flex justify-center"
                style={{
                  // Use bottom offset if you want it fixed near bottom or use top if preferred
                  top: `calc(60% + ${organizedByPos.y}px)`,
                  left: "50%",
                  transform: `translate(calc(-50% + ${organizedByPos.x}px), 0)`,
                  maxHeight: "64px",
                  overflowX: "auto",
                  overflowY: "auto",
                }}
              >
                <div
                  className="text-lg font-serif text-white rounded w-[80%] text-center whitespace-pre-wrap"
                  style={{
                    maxHeight: "64px",
                    overflowX: "auto",
                    overflowY: "auto",
                  }}
                >
                  Organized by | {formData.organizedBy}
                </div>
              </div>
            )}

            {/* Sponsor logos */}
            <div className="absolute bottom-2 left-2 right-2 overflow-x-auto p-2 bg-white/70 rounded mx-8">
              <div className="flex gap-2 justify-center min-w-full">
                {sponsorLogos.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Sponsor ${index + 1}`}
                    className="w-16 h-16 object-contain"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
