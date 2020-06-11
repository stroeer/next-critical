# Next Critical Next Plugin

This folder needs a short explanation why it is here and why it has a `src` subfolder.

`Next.js` has a experimental plugin API that works based on a `package.json` and the
structure of the file system.

In the `next.config.js` you can add these fields to add a plugin:

```json
{
  "experimental": {
    "plugins": true
  },
  "plugins": ["next-critical/plugins/next"]
}
```

1. Enable plugins via `experimental.plugins = true`
1. Add plugins via `plugins: ["array", "of", "plugins"]`

The array allows any path that can be resolved via node's `resolve`.

To implement a plugin you need 2 things:

1. A package.json containing at least these fields:
   ```json
   {
     "name": "Your Package Name",
     "nextjs": {
       "name": "Your Plugin Name",
       "required-env": []
     }
   }
   ```
1. A `src` folder with _specifically named files_. `Next` will look in the `src` folder
   for specific file names and if you provide these files, depending on the file name,
   those files will be used in `Next` in specific ways
1. The file `src/document-head-tags-server.js` can export a function and whatever that
   function returns will be included in the `<head>` section on the server side.
