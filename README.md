# Genshin Builder
An app dedicated to managing character builds and rotations.

## Setup
1. `git checkout https://github.com/quasikyo/genshinbuilder.git`
2. `cd genshinbuilder`
3. `npm install`
4. `npm run dev`

It is also recommended to use [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar).

## Type Support For `.vue` Imports in TS
Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
