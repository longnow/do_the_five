module.exports = {
  context: __dirname,
  entry: "./src/do_the_five.js",
  output: {
    path: __dirname + "/js",
    filename: "do_the_five.js",
    library: "dt5",
  },
};
