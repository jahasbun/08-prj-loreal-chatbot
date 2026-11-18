# Project 8: L’Oréal Beauty Assistant

This project is a beauty-focused chatbot for discovering L’Oréal products, routines, and recommendations. It includes a branded chat interface, multi-turn conversation history, and separate message bubbles for the user and assistant.

## Run the website

Open the repository in GitHub Codespaces or use a local web server such as VS Code Live Server. The chat needs a Cloudflare Worker URL; opening `index.html` by itself will not connect to the API.

## Connect the Cloudflare Worker

1. If your instructor has provided a class Worker URL, copy it into `WORKER_URL` near the top of `script.js`. In this case, you do not need to create or handle an API key.
2. If you have been asked to deploy your own Worker, sign in to Cloudflare and open **Workers & Pages**.
3. Create a Worker, open its code editor, and replace the starter code with the contents of `RESOURCE_cloudflare-worker.js`. Deploy it.
4. In the Worker settings, open **Variables and Secrets** and add a secret named `OPENAI_API_KEY`. Enter the key in Cloudflare's secret field only—never in a project file, browser code, or GitHub.
5. In `RESOURCE_cloudflare-worker.js`, make sure `allowedOrigins` includes the website's origin. For GitHub Pages, the origin looks like `https://your-username.github.io` (do not include the repository path). The starter list already includes this repository's origin and the common local Live Server origin.
6. Deploy the Worker and copy its `workers.dev` URL into `WORKER_URL` in `script.js`.
7. Open the website, send a beauty-related question, and check the browser's developer console if the Worker returns an error.

The browser sends a JSON body containing a `messages` array. The Worker adds the beauty-only system instructions, calls OpenAI using its secret, and returns the assistant's text from `data.choices[0].message.content`.

The origin allowlist helps control which websites can call the Worker from a browser, but it does not prevent direct requests from scripts or command-line tools. For a public deployment, also configure Cloudflare rate limiting and usage limits.
