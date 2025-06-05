const logger = require('../utils/logger');

class EmailService {
  async sendEmail(to, subject, text) {
    // Placeholder for email sending logic (e.g., using Nodemailer)
    logger.info(`Sending email to ${to} with subject: ${subject}`);
    // Implement email sending logic here
  }
}

module.exports = new EmailService();