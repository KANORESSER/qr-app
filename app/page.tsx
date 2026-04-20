"use client";
import { useState, useEffect } from "react";
// import QRCode from "react-qr-code";
import * as QRCodeLib from "qrcode";

export default function Home() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    if (!text) {
      setQrUrl("");
      return;
    }

    QRCodeLib.toDataURL(text, {
      width: 512,   // ← ここ追加（解像度アップ）
      margin: 2,    // ← 余白（読み取りやすくなる）
    }).then((url) => {
      setQrUrl(url);
    });
  }, [text]);

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

          <img
            src="/images/レッくんひょっこり.png"
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