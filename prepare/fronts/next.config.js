module.exports = {
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    return {
      ...config,
      mode: prod ? 'production' : 'dvelopment',
      devtool: prod ? 'hidden-source-map' : 'eval',
    };
  },
};
