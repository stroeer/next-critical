# Next Critical Babel Preset Plugin

This folder needs a short explanation why it is here and why it has a `src` subfolder.

`Next.js` uses its own `Babel` preset<sup>1</sup> and allows adding `BabelPresetPlugin`s via config.

To add a `BabelPresetPlugin` you need to add an object that in its minimal form contains a `dir` field
pointing to a folder.

```json
{
  "dir": "/path/to/a/folder"
}
```

that folder _must_ contain a `src` folder with a file called `babel-preset-build.js`. In that file
you may export a function that modifies a config with which you can add a `Babel` plugin. So that is
why there is this folder structure.

<sup>1 I think</sup>
