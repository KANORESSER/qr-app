"use client";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function Home() {
  const [text, setText] = useState("");

  const downloadQR = () => {
    const svg = document.getElementById("qr-code")?.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;

      ctx?.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = pngFile;
      a.download = "qr-code.png";
      a.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="h-svh">
      <header>
        <h1 className="flex justify-center items-center h-[100px] bg-[var(--color-brown)] text-white text-3xl font-bold mb-24 shrink-0">QRコードジェネレッサー</h1>
      </header>
      <main className="flex flex-col items-center justify-center p-4 flex-1">
        <div className="relative w-80 mt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border-2 rounded p-4 pr-16 bg-white shadow-md"
          />

          <img
            src="/images/レッくんひょっこり.png"
            alt="レッくん"
            className="absolute right-[0px] top-[-85px] w-30 pointer-events-none drop-shadow-md"
          />
        </div>

        <div id="qr-code" className="bg-white p-4 mt-4">
          <QRCode value={text} size={256} />
        </div>

        <button
          onClick={downloadQR}
          className="mt-4 bg-[var(--color-brown)] text-white px-4 py-2 rounded cursor-pointer"
        >
          ダウンロード
        </button>
      </main>
    </div>
  );
}