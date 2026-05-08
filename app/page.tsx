"use client";
import { useState, useEffect } from "react";
// import QRCode from "react-qr-code";
import * as QRCodeLib from "qrcode";

const SIZE_OPTIONS = [
  { label: "小（200px）", value: 200 },
  { label: "中（400px）", value: 400 },
  { label: "大（800px）", value: 800 },
  { label: "カスタム", value: "custom" },
] as const;

const MIN_SIZE = 100;
const MAX_SIZE = 2000;

export default function Home() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [sizeOption, setSizeOption] = useState<number | "custom">(400);
  const [customSize, setCustomSize] = useState("400");
  const [customError, setCustomError] = useState("");

  const resolvedSize =
    sizeOption === "custom" ? parseInt(customSize, 10) : sizeOption;

  useEffect(() => {
    if (!text || isNaN(resolvedSize) || resolvedSize < MIN_SIZE || resolvedSize > MAX_SIZE) {
      setQrUrl("");
      return;
    }

    QRCodeLib.toDataURL(text, {
      width: resolvedSize,
      margin: 2,
    }).then((url) => {
      setQrUrl(url);
    }).catch((err) => {
      console.error("QR生成エラー:", err);
    });
  }, [text, resolvedSize]);

  const handleCustomSizeChange = (value: string) => {
    setCustomSize(value);
    const n = parseInt(value, 10);
    if (!value || isNaN(n)) {
      setCustomError("数値を入力してください");
    } else if (n < MIN_SIZE) {
      setCustomError(`${MIN_SIZE}px 以上にしてください`);
    } else if (n > MAX_SIZE) {
      setCustomError(`${MAX_SIZE}px 以下にしてください`);
    } else {
      setCustomError("");
    }
  };

  const downloadQR = () => {
    if (!qrUrl) return;

    if (navigator.userAgent.match(/iPhone|Android/)) {
      // スマホ → 画像表示
      window.open(qrUrl, "_blank");
    } else {
      // PC → ダウンロード
      const a = document.createElement("a");
      a.href = qrUrl;
      a.download = "qr-code.png";
      a.click();
    }
  };

  return (
    <div className="h-svh">
      <header>
        <h1 className="flex justify-center items-center h-[100px] bg-[var(--color-brown)] text-white text-3xl font-bold mb-32 shrink-0">QRコードジェネレッサー</h1>
      </header>
      <main className="flex flex-col items-center justify-center p-4 flex-1">
        <div className="relative w-80">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border-2 rounded p-4 pr-16 bg-white shadow-md"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={encodeURI("/images/レッくんひょっこり.png")}
            alt="レッくん"
            className="absolute right-[0px] top-[-85px] w-30 pointer-events-none drop-shadow-md"
          />
          <div className="speech-bubble">
            スマホで写真フォルダに保存するときは<br />
            QRコードを長押ししてくレッサー🐾
          </div>
        </div>

        <div className="bg-white p-4 m-4 w-50 h-50 flex items-center justify-center text-center">
          {qrUrl ? (
            <img src={qrUrl} alt="QRコード" />
          ) : (
            <p className="text-gray-400">URLを入力してくレッサー🐾</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 mb-2">
          <select
            value={sizeOption}
            onChange={(e) => {
              const v = e.target.value;
              setSizeOption(v === "custom" ? "custom" : parseInt(v, 10));
            }}
            className="border-2 rounded px-3 py-2 bg-white shadow-sm"
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {sizeOption === "custom" && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customSize}
                  onChange={(e) => handleCustomSizeChange(e.target.value)}
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  className="border-2 rounded px-3 py-2 w-28 bg-white shadow-sm"
                  placeholder="例: 600"
                />
                <span className="text-gray-600">px</span>
              </div>
              {customError && (
                <p className="text-red-500 text-sm">{customError}</p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={downloadQR}
          disabled={!qrUrl || !!customError}
          className="mt-2 bg-[var(--color-brown)] text-white px-4 py-2 rounded cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ダウンロード
        </button>
      </main>
    </div>
  );
}