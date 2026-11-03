import { getAllArticles, getArticleBySlug } from './blogData';

describe('blogData Service', () => {
  test('getAllArticles returns all engineering blog articles', () => {
    const articles = getAllArticles();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);
  });

  test('each article contains required architectural metadata', () => {
    const articles = getAllArticles();
    articles.forEach((art) => {
      expect(art.slug).toBeDefined();
      expect(typeof art.slug).toBe('string');
      expect(art.title).toBeDefined();
      expect(art.category).toBeDefined();
      expect(art.date).toBeDefined();
      expect(art.readTime).toBeDefined();
      expect(Array.isArray(art.tags)).toBe(true);
      expect(art.summary).toBeDefined();
      expect(art.content).toBeDefined();
    });
  });

  test('getArticleBySlug retrieves an article by slug and returns null for invalid slug', () => {
    const valid = getArticleBySlug('clean-architecture-aspnet-core');
    expect(valid).not.toBeNull();
    expect(valid.title).toContain('ASP.NET Core');

    const invalid = getArticleBySlug('non-existent-article-slug-xyz');
    expect(invalid).toBeNull();
  });
});
