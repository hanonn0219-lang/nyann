# Magic English Buddy – Vercel かんたんセットアップ

「専門用語はむずかしい…」という方向けの、**やることだけ** まとめた説明です。

---

## 0. できあがりイメージ（今日やること）
- インターネット上に、あなた専用の小さな「受付」を置きます（＝Vercel で公開）
- GPT からその「受付」にリクエストが届くと、**フラッシュカード（CSV / PDF）** を作って渡します
- GPT の画面に **[Download CSV] [Download PDF]** のボタンが出ます

---

## 1. このフォルダを GitHub にアップする
1) まず GitHub にログイン（アカウントがなければ無料で作成）  
2) 画面右上「+」→ **New repository**（新しい入れ物を作る）  
3) リポジトリ名：`meb-vercel-starter`（お好みでOK）  
4) 作成後、**Add file → Upload files** からこのフォルダの中身をアップします  
   - フォルダごとではなく、中のファイル（`api/` など）をそのままドラッグ＆ドロップでOK  
   - アップしたら **Commit changes** を押す

---

## 2. Vercel につなげて公開（URL を手に入れる）
1) https://vercel.com にログイン  
2) **Add New → Project** を押す  
3) さきほど作った GitHub のリポジトリを選ぶ  
4) 設定はそのままで **Deploy** を押す  
5) 数十秒で、`https://〇〇.vercel.app` のような **あなたのURL** が表示されます  
   - 例：`https://magic-english-buddy.vercel.app`

> ※ もし失敗したら、もう一度「Import Project」からやり直せばOK

---

## 3. 動作チェック（健康診断）
ブラウザで、あなたのURLのあとに **`/api/v1/health`** をつけて開きます。

例：  
`https://magic-english-buddy.vercel.app/api/v1/health`

→ 画面に `{ "status": "ok", ... }` と出れば準備完了！

---

## 4. 秘密のカギ（APIキー）を設定
GPT からの呼び出しにだけ応えるため、合言葉を決めます。

1) Vercel のプロジェクト画面 → **Settings → Environment Variables**  
2) **Name** に `LEARNINGOPS_API_KEY`、**Value** に長いランダム文字列を入れる  
   - 例：`sk_live_xxxxxxx...`（自分で決めてOK）  
3) 右上の **Save** を押す → その後 **Deployments → Redeploy** で反映

> ※ GPT 側でも、同じ値を「Actions → Auth → API key（ヘッダー名 X-API-Key）」に入れます。

---

## 5. OpenAPI を GPT に登録
1) このフォルダの `openapi.yaml` を開いて、`https://YOUR_VERCEL_URL` を **あなたのURL** に置き換えます  
   - 例：`https://magic-english-buddy.vercel.app`（最後に `/` はつけない）  
2) GPTs の作成画面 → **Actions**  
   - **API domain** にも同じURLを入れます（1文字でも違うとエラーになります）  
   - **Add from OpenAPI** で `openapi.yaml` の中身を貼り付け → 保存  
3) **Test** ボタンから `/api/v1/health` や `/api/v1/flashcards` を試します

---

## 6. 使い方（フラッシュカード）
- GPT から `POST /api/v1/flashcards` に、こういう形で送ります：

```json
{
  "items": [
    { "english": "A latte, please.", "japanese": "ラテをお願いします。" },
    { "english": "To go, please.", "japanese": "持ち帰りでお願いします。" }
  ]
}
```

- 返ってくるもの：

```json
{
  "csv_url": "https://.../api/v1/files.csv?d=...",
  "pdf_url": "https://.../api/v1/files.pdf?d=..."
}
```

- それぞれのリンクを押すと、**ダウンロード**できます。

> しくみ：内容を小さな文字列にしてURLに入れ、開かれたときにその場でCSV/PDFを作っています（むずかしい設定は不要）。

---

## 7. 困ったときのチェック
- URL があっているか？（`https://`、最後に `/` をつけない）  
- `LEARNINGOPS_API_KEY` が **Vercel と GPT の両方**で同じか？  
- `/api/v1/health` が `ok` を返しているか？  
- まだダメなら、Vercel の **Deployments** 画面で最新のログを見てみる

---

## 補足
- PDF は A4 縦で、1ページに最大 9 枚（3×3）を並べます。10〜12枚のときは2ページになります。  
- CSV は `english, japanese, ipa, example` の4列です（`ipa` と `example` は空でもOK）。

---

以上です！少し時間はかかりますが、ゆっくり一歩ずつやれば大丈夫です。がんばりましょう 👍