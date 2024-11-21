# Instructions for documentation

  Doc comments standards for typescript:https://tsdoc.org/
  Comments to documentation generator library typedoc :https://typedoc.org/
  
# Some DOI and ORCIDs used for execution and testing

  DOIs

    Example from opencitations example page :"10.1002/adfm.201505328"
    Attention is all you need (inspiration behind chat GPT)"10.48550/arXiv.1706.03762"
  ORCIDs

# Helpful reference resources

## Crossref API
  https://api.crossref.org/swagger-ui/index.html
  https://www.crossref.org/documentation/retrieve-metadata/rest-api/a-non-technical-introduction-to-our-api/ 

## Opencitations for getting citations yearwise

  https://opencitations.net/index/coci/api/v1/citations/10.3389/fimmu.2020.602256
  https://opencitations.net/index/coci/api/v1#/citations/%7Bdoi%7D

## Standard documentation pages :
  https://reactrouter.com/en/main 
  https://mongoosejs.com/docs/ , 
  https://expressjs.com/en/4x/api.html ,
  https://react.dev/reference/react Video 
  
## Chart js (IN USE : FOR YEARWISE CITATION HISTOGRAM)
  https://www.chartjs.org/docs/latest/
## D3.js (may use , for chart and network graphs)
  https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js
  https://2019.wattenberger.com/blog/react-and-d3

  Guide to using D3 force
  https://medium.com/@qdangdo/visualizing-connections-a-guide-to-react-d3-force-graphs-typescript-74b7af728c90

# Information about project template: React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
