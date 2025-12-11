import { useState, useEffect } from "react";
import axios from "axios";

export function useAppVersion() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    const loadVersion = async () => {
      try {
        const res = await axios.get("base_props.prop", {
          responseType: "text",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        const lines = res.data.split("\n");

        for (const line of lines) {
          const [key, value] = line.split("=");

          if (key === "CONTENT_VERSION") {
            setVersion(value.trim());
            break;
          }
        }
      } catch (err) {
        console.error("Failed to load base_props.prop:", err);
      }
    };

    loadVersion();
  }, []);

  return version;
}
