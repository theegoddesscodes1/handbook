# The Handbook · Lilac Desk

The getting-started and help site included with every Lilac Desk product.
Live at **https://handbook.lilacdesk.com**

## Editing content
Everything you read on the site comes from **`data/products.json`**. Edit the text there, commit, and the site updates in about a minute.

- **Show or hide a product:** set `"hidden": true` or `false`.
- **Guides:** the `guides` list. Each guide has `steps.default`, and optional app-specific steps like `steps.goodnotes`, `steps.notability`, `steps.samsungnotes`.
- **Setup order:** the `setup` list (the five Getting started steps).
- **Questions:** the `faq` list. **Troubleshooting:** the `trouble` list.
- **Videos:** upload the clip to `videos/`, then set its `src` (for example `"videos/import.mp4"`) in `videos`, and the matching guide's `clip`.

## Adding a planner's page map
1. Export each page as a JPG, 1200 × 1600, into `images/<product-handle>/`.
2. In `data/products.json`, add the pages to that product's `pages`, with `links` for each page.
   `x` and `y` are the dot position in percent from the top left of the page.
3. Set `"hidden": false`.

## The link to send customers
`https://handbook.lilacdesk.com/?p=<product-handle>`
The handle is the end of the product's URL on lilacdesk.com. The site remembers it after the first visit.
