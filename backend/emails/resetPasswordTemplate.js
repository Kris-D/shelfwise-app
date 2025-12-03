const resetPasswordTemplate = (username, resetUrl, year, timestamp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>Password Reset</title>
   </head>
    <body  style="margin: 0; padding: 0; padding-bottom: 40px; margin-bottom: 0; font-family: Arial, sans-serif; background-color: #FFFBF9; color: #333;" 
  bgcolor="#FFFBF9" 
  text="#333333"
>
      <div style="max-width: 600px; margin: 20px auto; padding-top:40px; padding: 20px; background-color: #FEFBFE; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:shelfwise-logo" alt="ShelfWise Logo" style="width: 120px;" />
        </div>

        <h2 style="color: #333; font-size: 22px; margin-bottom: 16px;">Hello ${username}!</h2>

        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
          You requested for a password reset. Click the link below to reset your password:
        </p>

        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          Reset link is valid for 30 minutes only.
        </p>

        <div style="text-align: center; margin-bottom: 40px;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Reset Your Password
          </a>
        </div>

        

        <p style="color: #555; font-size: 16px; margin-bottom: 8px;">Regards,</p>
        <p style="color: #555; font-size: 16px;"><strong>ShelfWise Team</strong></p>
      </div>

      <div style="text-align: center; color: #999; font-size: 12px; margin-top: 10px;">
        &copy; ${year} ShelfWise. All rights reserved.
      </div>
      <p style="display: none !important;">${timestamp}</p>
    </body>
    </html>
  `;
};

module.exports = resetPasswordTemplate;
