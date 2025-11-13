export default {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(uuid)/)" // proses ulang uuid agar bisa dibaca Jest
  ],
};
