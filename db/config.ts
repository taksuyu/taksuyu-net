import { column, defineDb, defineTable, NOW } from 'astro:db';

const metaColumns = {
  id: column.number({ primaryKey: true }),
  createdAt: column.date({ default: NOW }),
  updatedAt: column.date({ default: NOW }),
};

const Author = defineTable({
  columns: {
    ...metaColumns,
    name: column.text(),
  },
});

const Post = defineTable({
  columns: {
    ...metaColumns,
    publicId: column.text({ unique: true }),
    authorId: column.number({ references: () => Author.columns.id }),
    likes: column.number({ default: 0 }),
    metadata: column.json(),
    language: column.text({ default: 'en' }),
    content: column.text(),
  },
  indexes: [{ on: 'publicId' }, { on: 'language' }],
});

const Comment = defineTable({
  columns: {
    // ids and meta
    ...metaColumns,
    publicId: column.text({ unique: true }),
    postId: column.number({ references: () => Post.columns.id }),

    // If we want to show a reference to a comment that's being replied to or putting it in sequence, our reply should be in context
    // replyPostId: column.text({ references: () => Comment.columns.id }),

    // shown content of the post
    name: column.text(),
    content: column.text(),
  },
  indexes: [{ on: 'postId' }],
});

// https://astro.build/db/config
export default defineDb({
  tables: { Author, Comment, Post },
});
