module.exports = function (eleventyConfig) {
  const markdownIt = require("markdown-it");
  const md = markdownIt({ html: true, linkify: true, breaks: false });
  eleventyConfig.addFilter("markdown", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("markdownInline", (s) => (s ? md.renderInline(String(s)) : ""));

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });

  eleventyConfig.addCollection("editions", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("edition")
      .sort((a, b) => Number(b.data.year) - Number(a.data.year));
  });

  eleventyConfig.addFilter("where", function (arr, key, val) {
    return (arr || []).filter((item) => item[key] === val);
  });
  eleventyConfig.addFilter("default", function (value, fallback) {
    return value === undefined || value === null || value === "" ? fallback : value;
  });

  eleventyConfig.addWatchTarget("src/assets/");

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};
