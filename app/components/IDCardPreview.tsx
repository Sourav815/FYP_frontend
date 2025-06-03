// components/IDCardPreview.tsx
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

export default function IDCardPreview({
  template,
  formData,
  positions,
  templateImages,
  roleStyles = {}, // Add roleStyles prop with default empty object
}) {
  // Predefined font sizes for different elements
  const fontSizes = {
    name: "24px",
    role: "22px",
    affiliation: "16px",
    conferenceName: "28px",
    conferenceVenue: "20px",
    date: "20px",
    id: "14px",
  };

  // Default role style if the role doesn't match any predefined styles
  const defaultStyle = { bgColor: "transparent", textColor: "#000000" };

  return (
    <div className="md:col-span-1 bg-white p-6 rounded-xl shadow text-center flex flex-col items-center justify-start m-2">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">ID Card Preview</h2>

      <div
        id="card-preview"
        className="relative w-full aspect-[3/4] h-[600px] max-h-[80vh] border border-dashed border-gray-400 rounded-lg overflow-hidden bg-gray-50"
      >
        <Image
          src={templateImages[template]}
          alt={`${template} template`}
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
          fill
        />

        <div className="relative z-10 h-full px-4 text-gray-800 flex flex-col items-center">
          {/* Name */}
          <div
            key="name"
            className="absolute text-center w-full"
            style={{ transform: `translate(${positions.name?.x}px, ${positions.name?.y}px)` }}
          >
            <p 
              className="font-semibold font-serif" 
              style={{ fontSize: fontSizes.name }}
            >
              {formData.name || "Name"}
            </p>
          </div>

          {/* Role with background color based on role */}
          <div
            key="role"
            className="absolute text-center px-20 py-1 rounded-full"
            style={{ 
              transform: `translate(${positions.role?.x}px, ${positions.role?.y}px)`,
              backgroundColor: roleStyles[formData.role]?.bgColor || defaultStyle.bgColor,
              color: roleStyles[formData.role]?.textColor || defaultStyle.textColor
            }}
          >
            <p 
              className="font-semibold" 
              style={{ fontSize: fontSizes.role }}
            >
              {formData.role || "Role"}
            </p>
          </div>

          {/* Other elements without special styling */}
          {["affiliation", "conferenceName", "conferenceVenue", "date", "id"].map((key) => (
            <div
              key={key}
              className="absolute text-center max-w-sm px-8 leading-7"
              style={{ transform: `translate(${positions[key]?.x}px, ${positions[key]?.y}px)` }}
            >
              <p 
                className="font-semibold" 
                style={{ fontSize: fontSizes[key] }}
              >
                {formData[key] || key}
              </p>
            </div>
          ))}

          <div
            className="absolute flex flex-col items-center"
            style={{ transform: `translate(${positions.qr?.x}px, ${positions.qr?.y}px)` }}
          >
            <QRCodeSVG
              value={
                `ID: ${formData.id} | Name: ${formData.name} | Role: ${formData.role} | Conference: ${formData.conferenceName}` ||
                "QR Data"
              }
              size={80}
            />
          </div>
        </div>
      </div>
    </div>
  );
}