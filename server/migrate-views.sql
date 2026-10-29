-- 为文章表增加阅读量字段（可重复执行）
USE personal_blog;

ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS view_count INT NOT NULL DEFAULT 0 AFTER content;
