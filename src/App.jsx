import { extractColors } from "extract-colors";
import React, { useEffect } from "react";
import { useStore } from "./store";
import useFileInput from "./useFileInput";
import logo from "./logo.png";

const getImageData = async function (file) {
  const bitmap = await new Promise((resolve) => {
    let img = document.createElement("img");
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.src = URL.createObjectURL(file);
  });

  const [width, height] = [bitmap.width, bitmap.height];

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  ctx.drawImage(bitmap, 0, 0);

  return [ctx.getImageData(0, 0, width, height), bitmap];
};

export default function App() {
  const isPlaying = useStore((store) => store.isPlaying);
  const set = useStore((store) => store.set);
  const colors = useStore((store) => store.colors);
  const handleFileSelect = useFileInput(
    ([file]) => {
      (async () => {
        const [imgData, img] = await getImageData(file);
        const colors = await extractColors(imgData);
        set((store) => {
          store.colors = colors.map((color) => color.hex);
          store.img = img.src;
        });
      })();
    },
    { accept: "image/*" }
  );

  useEffect(() => {
    window.addEventListener("keyup", (e) => {
      if (e.code === "Escape") {
        set((store) => {
          store.isPlaying = false;
        });
      }
    });
  }, []);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      {!isPlaying ? (
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="flex items-center justify-center h-screen">
            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      NiftyBird
                    </h3>
                    <div className="mt-2">
                      <p>
                        Select your favorite jpeg. Preferably an NFT you bought
                        on Rainbow 🌈. Press play and click to hop.
                      </p>
                      <input id="hidden-input" type="file" className="hidden" />
                      <div className="flex items-center gap-4">
                        <button
                          id="button"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:w-auto my-2 sm:text-sm"
                          onClick={handleFileSelect}
                        >
                          {`Upload a${colors.length > 0 ? "nother" : ""} file`}
                        </button>
                        {colors.length > 0 && (
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">Colors</span>
                            <div className="flex">
                              {colors.map((color) => (
                                <div
                                  className="w-8 h-8"
                                  style={{ background: color }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Hacked together in a couple of hours after seeing this
                        funny{" "}
                        <a
                          href="https://twitter.com/mikedemarais/status/1496593348806778889"
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                          tweet
                        </a>{" "}
                        from{" "}
                        <a
                          href="https://twitter.com/mikedemarais"
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                          @mikedemarais
                        </a>
                        . Checkout my{" "}
                        <a
                          href="https://dries.io"
                          target="_blank"
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                          portfolio
                        </a>
                        , or the{" "}
                        <a
                          href="https://github.com/driescroons/niftybird"
                          target="_blank"
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                          source
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300"
                  disabled={colors.length === 0}
                  onClick={() =>
                    set((store) => {
                      store.isPlaying = true;
                    })
                  }
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <span
          className="inline-block text-4xl p-2 hover:animate-wiggle cursor-pointer select-none"
          onClick={() => {
            set((store) => {
              store.isPlaying = false;
            });
          }}
        >
          👈
        </span>
      )}
      <a
        href="https://dries.io"
        target="_blank"
        className="fixed bottom-0 right-0 w-8 h-8 z-20 flex justify-center items-center"
        style={{ backgroundColor: "#0000ff" }}
      >
        <img
          src={logo}
          className="object-contain w-4 h-4 hover:animate-wiggle select-none"
          alt="Dries' Logo"
        />
      </a>
    </div>
  );
}
