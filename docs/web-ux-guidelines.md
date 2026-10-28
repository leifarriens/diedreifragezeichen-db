# Web UX Guidelines

Contains guidelines about accessibility and SEO.

## Images

### Standard `alt` Attributes

- **Requirement:** Always use the native `alt` attribute.
- **Accessibility:** Screen readers read `alt` text aloud so visually impaired users understand the content or context of an image. If an image is purely decorative, use `alt=""` so screen readers ignore it.
- **SEO:** Search engines use `alt` text to understand image content and index it in image search.
- **Handling Context:**
- **Album Covers:** If the image stands alone, use descriptive text like `alt="Album cover for [Album Name] by [Artist]"`. If the artist and album name are already displayed in nearby visible text, treat the image as decorative with `alt=""`.
- **Header Logos:** When a logo acts as a link back to the homepage, set the image alt text to your company name (e.g., `alt="Company Name"`).

### Skipping `title` and `aria-label`

- Do not use `title` or `aria-label` on standard `<img>` tags.
- The `title` attribute creates hover tooltips that fail on mobile devices and keyboard navigation.
- The `aria-label` attribute is redundant on images, as `alt` is the native, universally supported standard for image text alternatives.

---

## Links

### Visible Anchor Text First

- **SEO & Usability:** The primary way search engines and users understand a link is through its visible anchor text. Keep link text clear, descriptive, and relevant to the target destination.

### `aria-label` for Icon-Only Links

- **Accessibility:** Use `aria-label` only when a link contains no visible text, such as a standalone search glass icon or a social media icon button.
- **Example:** `<a href="/search" aria-label="Search">...</a>` ensures screen readers announce the link destination properly.

### Avoiding `title` on Links

- Avoid using the `title` attribute on links. Screen reader support for link titles is inconsistent, and tooltips provide a poor experience for mobile and non-mouse users.
