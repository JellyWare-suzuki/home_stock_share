# Home Stock Share

家族で共有する備品管理アプリです。家庭の備品在庫を管理し、買い物リストを作成できます。

## 主な機能

### 📦 備品リスト
- 家庭の備品を登録・管理
- 在庫数量の追跡
- カテゴリー分け
- 数量の増減（購入・使用の記録）
- 備品の削除

### 📝 操作ログ
- すべての備品操作を自動記録
- 誰がいつ何をしたか確認可能
- 追加・更新・削除の履歴を保存
- コメント機能で理由やメモを残せる

### 🛒 買い物リスト
- 買う予定の物を登録
- 数量とメモを記入可能
- 購入済みマーク機能
- 未購入と購入済みを分けて表示
- タブに未購入件数を表示

## 技術スタック

- **フロントエンド**: React + TypeScript
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **データベース**: Supabase (PostgreSQL)
- **リアルタイム更新**: Supabase Realtime
- **ビルドツール**: Vite

## セットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/JellyWare-suzuki/home_stock_share.git
cd home_stock_share
```

2. 依存パッケージをインストール
```bash
npm install
```

3. 環境変数を設定

`.env`ファイルに以下を設定：
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 開発サーバーを起動
```bash
npm run dev
```

5. ブラウザで開く
```
http://localhost:5173
```

## データベース構造

### items テーブル
備品情報を管理
- `id`: UUID（主キー）
- `name`: 備品名
- `quantity`: 在庫数量
- `category`: カテゴリー
- `created_at`: 作成日時
- `updated_at`: 更新日時

### logs テーブル
操作履歴を記録
- `id`: UUID（主キー）
- `item_id`: 備品ID（外部キー）
- `item_name`: 備品名のスナップショット
- `action`: 操作種別（add/update/remove/delete）
- `quantity_change`: 数量の変化
- `comment`: コメント
- `created_at`: 操作日時

### shopping_list テーブル
買い物リストを管理
- `id`: UUID（主キー）
- `item_name`: 買う物の名前
- `quantity`: 購入予定数量
- `is_completed`: 購入済みフラグ
- `memo`: メモ
- `created_at`: 追加日時
- `completed_at`: 購入完了日時

## 使い方

### 備品の追加
1. 「備品リスト」タブを選択
2. 「新規追加」ボタンをクリック
3. 備品名、数量、カテゴリー、コメントを入力
4. 「追加」ボタンをクリック

### 在庫の更新
1. 備品カードの「+」または「-」ボタンをクリック
2. 変更内容とコメントを入力
3. 「確認」ボタンをクリック

### 買い物リストの使用
1. 「買い物リスト」タブを選択
2. 「追加」ボタンをクリック
3. 買う物の名前、数量、メモを入力
4. 買い物に行く
5. 購入したらチェックボタンをクリックして購入済みにする

### 操作ログの確認
1. 「操作ログ」タブを選択
2. 時系列で操作履歴を確認
3. いつ誰が何をしたかコメント付きで確認可能

## ビルド

本番用にビルド：
```bash
npm run build
```

ビルドされたファイルは`dist`ディレクトリに出力されます。

## スクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番用ビルド
- `npm run preview` - ビルド結果のプレビュー
- `npm run lint` - ESLintでコードチェック
- `npm run typecheck` - TypeScriptの型チェック

## セキュリティ

- Row Level Security (RLS)を有効化
- 匿名ユーザーと認証済みユーザーの両方がアクセス可能
- 家族での共有を想定した設計

## ライセンス

このプロジェクトはプライベート使用を想定しています。
