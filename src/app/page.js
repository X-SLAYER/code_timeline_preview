"use client";

import React, { useState, useRef } from "react";
import { Download ,Github} from "lucide-react";
import html2canvas from "html2canvas";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeTimeline = () => {
  const [codeInput, setCodeInput] = useState("");
  const [timelineData, setTimelineData] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const timelineRef = useRef(null);
  const [elementTypes, setElementTypes] = useState({
    keyword: "#FF6B6B", // Soft Red
    class: "#4ECDC4", // Teal
    function: "#45B7D1", // Sky Blue
    variable: "#96CEB4", // Sage Green
    operator: darkMode ? "#FFD93D" : "#FFD700", // Soft yellow
    string: "#FF8C42", // Soft Orange
    number: "#6A0572", // Deep Purple
    boolean: "#FF4081", // Pink
    comment: "#78909C", // Blue Grey
    import: "#26A69A", // Green Teal
    decorator: "#BA68C8", // Light Purple
    punctuation: "#B0BEC5", // Light Blue Grey
    bracket: "#00BCD4", // Cyan
    property: "#8BC34A", // Light Green
    space: "transparent",
    default: darkMode ? "#E0E0E0" : "#424242", // Light Grey / Dark Grey
  });

  const keywords = [
    "class",
    "function",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "return",
    "import",
    "from",
    "async",
    "await",
    "try",
    "catch",
    "throw",
    "new",
    "this",
    "super",
  ];

  const tokenizeLine = (line) => {
    const tokens = line.split(/(\s+|[{}()[\],;.])/);

    return tokens
      .map((token) => {
        if (!token) return null;

        let color = elementTypes.default;
        let width = token.length * 8;

        if (token.trim() === "") {
          return {
            text: token,
            color: elementTypes.space,
            width: token.length * 8,
          };
        }

        if (keywords.includes(token)) {
          color = elementTypes.keyword;
        } else if (token.match(/^[A-Z][a-zA-Z0-9]*$/)) {
          color = elementTypes.class;
        } else if (token.match(/^[a-z][a-zA-Z0-9]*(?=\()/)) {
          color = elementTypes.function;
        } else if (token.match(/^[a-z][a-zA-Z0-9]*$/)) {
          color = elementTypes.variable;
        } else if (token.match(/[+\-*/%=<>!&|^~]/)) {
          color = elementTypes.operator;
        } else if (token.match(/^(['"]).*\1$/)) {
          color = elementTypes.string;
        } else if (token.match(/^\d+$/)) {
          color = elementTypes.number;
        } else if (token === "true" || token === "false") {
          color = elementTypes.boolean;
        } else if (token.startsWith("//")) {
          color = elementTypes.comment;
        } else if (token === "import" || token === "from") {
          color = elementTypes.import;
        } else if (token.startsWith("@")) {
          color = elementTypes.decorator;
        } else if (token.match(/[{}()[\]]/)) {
          color = elementTypes.bracket;
        } else if (token.match(/[.,;]/)) {
          color = elementTypes.punctuation;
        }

        return { text: token, color, width };
      })
      .filter(Boolean);
  };

  const generateTimelineFromCode = (code) => {
    const lines = code.split("\n");
    return lines
      .map((line, index) => ({
        id: index + 1,
        segments: tokenizeLine(line),
      }))
      .filter((line) => line.segments.length > 0);
  };

  const handleInputChange = (newCode) => {
    setCodeInput(newCode);
    setTimelineData(generateTimelineFromCode(newCode));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const exportImage = async () => {
    if (timelineRef.current) {
      const clone = timelineRef.current.cloneNode(true);

      document.body.appendChild(clone);

      const { scrollWidth, scrollHeight } = clone;

      const canvas = await html2canvas(clone, {
        width: 922,
        height: scrollHeight,
        backgroundColor: darkMode ? "#2D2D2D" : "#FFFFFF",
        scale: window.devicePixelRatio,
      });

      document.body.removeChild(clone);

      const image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "code-timeline.png";
      link.href = image;
      link.click();
    }
  };

  // useEffect(() => {
  //   const darkModeSetting = localStorage.getItem("darkMode");
  //   const isDarkMode = darkModeSetting === "true" || darkModeSetting === null;
  //   setDarkMode(isDarkMode);

  //   setElementTypes((prev) => ({
  //     ...prev,
  //     operator: !isDarkMode ? "#FFD93D" : "#FFD700",
  //     default: !isDarkMode ? "#E0E0E0" : "#424242",
  //   }));
  //   setTimelineData(generateTimelineFromCode(codeInput));
  // }, [codeInput, darkMode]);

  return (
    <div className={`p-6 h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Code Timeline Visualizer
        </h2>
        <div className="flex items-center space-x-4">
          {/* <div className="flex items-center space-x-2">
            <Toggle onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className={`h-4 w-4 ${"text-gray-400"}`} />
              ) : (
                <Moon className={`h-4 w-4 ${"text-gray-600"}`} />
              )}
            </Toggle>
          </div> */}

          <a
            href="https://github.com/X-SLAYER/code_timeline_preview"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <Github className="w-4 h-4" />
          </a>

          <button
            onClick={exportImage}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3
        className={`text-md font-semibold mb-3 ${
          darkMode ? "text-gray-400" : "text-gray-800"
        }`}
      >
        See your code come to life!
      </h3>

      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        <div className="flex flex-col w-1/2">
          <AceEditor
            placeholder="Paste your code here..."
            theme={darkMode ? "dracula" : "github"}
            value={codeInput}
            mode={"dart"}
            width="100%"
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={false}
            height="100%"
            setOptions={{
              fontSize: "16px",
            }}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col w-1/2">
          <div
            ref={timelineRef}
            className={`flex-1 overflow-auto rounded-lg p-4 border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-2">
              {timelineData.map((row) => (
                <div key={row.id} className="flex items-center">
                  <span
                    className={`w-8 text-sm font-mono ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {row.id}
                  </span>
                  <div className="flex items-center">
                    {row.segments.map((segment, segIndex) => (
                      <div
                        key={segIndex}
                        className="h-4 rounded transition-all duration-200 hover:opacity-80 mx-[1px]"
                        style={{
                          width: `${segment.width}px`,
                          backgroundColor: segment.color,
                        }}
                        title={segment.text}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mt-4 p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-wrap gap-3 text-xs">
              {Object.entries(elementTypes).map(
                ([key, color]) =>
                  key !== "space" &&
                  key !== "default" && (
                    <div key={key} className="flex items-center">
                      <div
                        className="w-3 h-3 mr-1 rounded"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTimeline;
