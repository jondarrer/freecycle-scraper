const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'fc-refresh-session': './src/fc-refresh-session.js',
    'fc-spinner': './src/fc-spinner.js',
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
    ],
  },
  externals: 'pg-native',
};
