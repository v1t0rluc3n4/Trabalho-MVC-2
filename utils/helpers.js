const isProduction = () => process.env.APP_ENV === 'production';

module.exports = {
  isProduction,
  formatDate: (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};