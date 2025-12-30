Surtopya 專案進度報告 (Status Report)
任務概覽
目前主要集中於優化問卷建立器 (Survey Builder) 的功能、介面一致性以及佈景主題整合。

已完成項目 (Completed)
1. 佈景主題整合 (Theme Integration)
進度條顏色優化：問卷填寫頁面的進度條現在會正確使用佈景主題設定的 primaryColor。
智慧文字對比：實作了 getContrastColor 工具函式，系統會根據背景顏色的明暗度自動切換文字為黑色或白色，確保最佳的可讀性。
套用範圍：已套用於問卷標題、描述、頁面資訊以及進度條提示文字。
2. 「發佈」按鈕邏輯修正 (Publish Button Logic)
觸發條件修正：修正了單頁問卷在有問題的情況下發佈按鈕仍被禁用的問題。現在只要問卷內包含至少一個問題，且有未儲存的變更，發佈按鈕即會啟用。
變更追蹤：確保所有編輯操作（如修改題目、調整佈景等）都會正確觸發 notifyChange()。
3. 用語標準化 (Terminology Standardization)
術語統一：根據 glossary.md，將程式碼與介面中的 "Private" 統一改為 "Non-public" (非公開)。
圖標修正：儀表板設定頁面的發佈圖標已統一改為「發送到 (Send)」圖標（紙飛機圖示），保持全站一致。
4. UI/UX 優化
新增頁面按鈕回歸：將「新增頁面」按鈕重新放置於畫布底部，方便使用者操作。
問題計數修正：修正了導覽列中的題目計數，現在會排除「分頁/分段」標籤。
切換面板優化：精簡並優化了 Builder 與 Settings 之間的切換邏輯，並強化了選中狀態的視覺表現。
拖放優化：解決了題目拖拽時產生的「鬼影 (ghosting)」視覺問題。
進行中項目 (In Progress)
1. 頁面深層複製 (Deep Page Duplication)
目標：實作頁面複製功能，確保複製頁面時，其中的所有問題也會一併複製，並產生新的唯一 ID (nanoid)。
2. 非公開問卷資料集貢獻邏輯
目標：調整發佈設定，允許「非公開問卷」也能選擇是否加入資料集市場，移除先前的硬性限制。
下一步計劃 (Next Steps)
在 survey-builder.tsx 中實作 duplicatePage 函式。
更新發佈設定對話框中的資料集貢獻切換開關 (Switch) 邏輯。
進行最終全功能測試。
更新 walkthrough.md 與 todo.md。