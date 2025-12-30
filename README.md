# Dr. Career Insight

**AI-Powered Career Psychometrics & Roadmap Generator**

Dr. Career Insight is a modern React application that uses Google's Gemini AI to provide personalized career guidance. Unlike generic career quizzes, it employs a two-phase diagnostic system to align your natural talents with your current life context.

## 🚀 Features

*   **Phase 1: Talent Digger**: A psychometric assessment to identify your natural cognitive wiring and working style.
*   **Phase 2: Context Audit**: A stage-specific analysis (Student, Professional, Late Career) to understand your constraints and goals.
*   **AI Analysis**: Uses **Gemini 1.5 Flash** (or compatible) to correlate your scores and generate a bespoke career strategy.
*   **Visual Roadmap**: Customized 3-level roadmap (Beginner, Intermediate, Advanced) to guide your growth.
*   **Privacy First**: Runs entirely in your browser; your data is sent directly to Google's API without intermediate storage.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google Generative AI SDK (`@google/genai`)
*   **Icons**: Lucide React

## 📦 Run Locally

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure API Key**:
    Create a `.env.local` file in the root:
    ```env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
4.  **Start the server**:
    ```bash
    npm run dev
    ```

## 🐳 Run with Docker

Build and run the application in a container:

1.  **Build the image**:
    ```bash
    # You must provide the API key at build time for Vite
    docker build --build-arg VITE_GEMINI_API_KEY=your_key_here -t career-insight .
    ```
2.  **Run the container**:
    ```bash
    docker run -p 8080:80 career-insight
    ```
3.  Open `http://localhost:8080`

## 📄 License

MIT
