"use strict";
require("dotenv").config();
const i18n = require("i18n");
const express = require("express");
const globalConfig = require("./src/configs/global.config");
const { hindiTranslations } = require("./locales/hindi");
const { englishTranslations } = require("./locales/english");
const { setLocalLang } = require("./src/middlewares/i18n.middleware");
const { langConstants } = require("./src/constants");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Internationalization Configuration
i18n.configure({
  locales: langConstants.locale,
  defaultLocale: langConstants.default_locale,
  staticCatalog: {
    en: hindiTranslations,
    ar: englishTranslations,
  },
  header: "accept-language",
  extension: ".js",
  retryInDefaultLocale: true,
});

app.use(i18n.init);

app.use((req, res, next) => {
  res.__ = setLocalLang;
  next();
});

app.use("/api/v1", express.static("public"), require("./src/routes/api/v1"));

app.listen(globalConfig.port, () => {
  console.log(`Server is running on port ${globalConfig.port}`);
});

module.exports = app;
