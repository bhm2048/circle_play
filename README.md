<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

這個專案已配置好本地運行與自動部署的相關設定。

View your app in AI Studio: https://ai.studio/apps/56c81372-a6c1-4724-8e04-6d31dfe4ab8f

## 🚀 專案建置與本地執行 (Run Locally)

**Prerequisites:**  Node.js

1. **安裝依賴套件 (Install dependencies):**
   ```bash
   npm install
   ```

2. **設定環境變數 (Environment Variables):**
   請複製 `.env.example` 並重新命名為 `.env.local`，填入你的 Gemini API key：
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. **啟動開發伺服器 (Start Dev Server):**
   ```bash
   npm run dev
   ```
   你可以透過終端機顯示的 URL 來預覽你的應用程式。

## 📦 GitHub Actions 自動部署 (Deployment)

這個專案已經設定好 GitHub Actions，當你推送到 `main` 分支時，會自動部署到 [GitHub Pages](https://pages.github.com/)。

**部署前確認事項：**
1. 如果你的專案不是在 GitHub User/Organization 的根網域下（例如是 `https://<username>.github.io/<repo-name>/`），請確保你在 `vite.config.ts` 中設定 `base: '/<repo-name>/'`。
2. 在 GitHub 存放庫的 **Settings > Pages** 頁面中，將 "Source" 變更為 **GitHub Actions**。 
3. 將代碼 `push` 到 `main` 分支即可自動觸發打包與部署。

## 🛡️ .gitignore 設定

專案中的 `.gitignore` 已經過設計，會自動忽略：
- `node_modules/` (套件檔案)
- `dist/`, `build/` (打包建置出的成品)
- `.env.local`, `.env` (包含隱私金鑰的檔案，請勿上傳)
- `.vscode/`, `.DS_Store` 等編輯器及系統產生的暫存檔
