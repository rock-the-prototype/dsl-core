/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/server/playground_handler.ts

import { parseRequirement } from "../parser/parser.ts";

// --- HTML PLAYGROUND PAGE ---------------------------------------------------

const htmlPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Audit-by-Design DSL Playground</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 2rem;
      max-width: 960px;
    }
    h1 {
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
    }
    textarea {
      width: 100%;
      min-height: 120px;
      font-family: monospace;
      font-size: 0.95rem;
      padding: 0.75rem;
      box-sizing: border-box;
    }
    button {
      margin-top: 0.75rem;
      padding: 0.6rem 1.2rem;
      font-size: 0.95rem;
      cursor: pointer;
    }
    .result {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 6px;
      background: #f5f5f5;
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 0.9rem;
    }
    .success {
      border-left: 4px solid #2e7d32;
    }
    .error {
      border-left: 4px solid #c62828;
    }
    .meta {
      font-size: 0.8rem;
      color: #666;
      margin-top: 0.5rem;
    }
    label {
      font-weight: 600;
      display: block;
      margin-bottom: 0.25rem;
    }
  </style>
</head>
<body>
  <h1>Audit-by-Design DSL Playground</h1>
  <p>
    Enter a DSL requirement in the canonical form, e.g.:<br />
    <code>As a system, I must validate the access token when receiving an ePrescription request then log success or failure.</code>
  </p>

  <label for="dsl-input">DSL Requirement</label>
  <textarea id="dsl-input">As a system, I must validate the access token when receiving an ePrescription request then log success or failure.</textarea>
  <button id="run-btn">Parse &amp; Validate</button>

  <div id="result" class="result" style="display:none;"></div>
  <div id="meta" class="meta"></div>

  <script>
    const btn = document.getElementById("run-btn");
    const inputEl = document.getElementById("dsl-input");
    const resultEl = document.getElementById("result");
    const metaEl = document.getElementById("meta");

    btn.addEventListener("click", async () => {
      const text = inputEl.value.trim();
      if (!text) {
        resultEl.style.display = "block";
        resultEl.className = "result error";
        resultEl.textContent = "Please enter a DSL statement.";
        metaEl.textContent = "";
        return;
      }

      try {
        const res = await fetch("/api/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });

        const data = await res.json();
        resultEl.style.display = "block";

        if (data.success) {
          resultEl.className = "result success";
          resultEl.textContent =
            "✅ Parsed Requirement Atom:\\n\\n" +
            JSON.stringify(data.requirement, null, 2);

          if (data.normalized) {
            metaEl.textContent = "Normalized input: " + data.normalized;
          } else {
            metaEl.textContent = "";
          }
        } else {
          resultEl.className = "result error";
          resultEl.textContent =
            "❌ Error while parsing:\\n\\n" +
            (data.error || "Unknown error");
          metaEl.textContent = "";
        }
      } catch (err) {
        resultEl.style.display = "block";
        resultEl.className = "result error";
        resultEl.textContent =
          "❌ Request failed:\\n\\n" + (err && err.message ? err.message : String(err));
        metaEl.textContent = "";
      }
    });
  </script>
</body>
</html>`;

// --- JSON RESPONSE UTIL -----------------------------------------------------

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

// --- MAIN HANDLER -----------------------------------------------------------

export async function handlePlayground(
  req: Request,
): Promise<Response | null> {
  const { pathname } = new URL(req.url);

  // GET /
  if (req.method === "GET" && pathname === "/") {
    return new Response(htmlPage, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // POST /api/parse (Playground-specific parsing)
  if (req.method === "POST" && pathname === "/api/parse") {
    try {
      const body = await req.json().catch(() => ({}));
      const text = typeof body.text === "string" ? body.text : "";

      if (!text.trim()) {
        return jsonResponse({
          success: false,
          error: "No DSL text provided.",
        }, 400);
      }

      const requirement = parseRequirement(text);

      return jsonResponse({
        success: true,
        requirement,
      });
    } catch (err) {
      return jsonResponse({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }, 422);
    }
  }

  return null; // Not handled -> let server.ts continue
}
