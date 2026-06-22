import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

mail_username = os.getenv("MAIL_USERNAME", "harikanchu4275@gmail.com").strip()
mail_password = "".join(os.getenv("MAIL_PASSWORD", "").split())
mail_from = os.getenv("MAIL_FROM", mail_username).strip()

conf = ConnectionConfig(
    MAIL_USERNAME=mail_username,
    MAIL_PASSWORD=mail_password,
    MAIL_FROM=mail_from,
    MAIL_PORT=int(os.getenv("MAIL_PORT", "587")),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


def build_password_reset_template(username: str, reset_link: str) -> str:
    return f"""
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,sans-serif;color:#172033;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f3f6fb;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e9f2;">
                <tr>
                  <td style="background:#1b2948;padding:24px 28px;color:#ffffff;">
                    <h1 style="margin:0;font-size:24px;line-height:1.3;">ML Studio</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 28px;">
                    <h2 style="margin:0 0 12px;font-size:22px;color:#0f172a;">Reset your password</h2>
                    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">
                      Hi {username}, we received a request to reset your ML Studio password.
                    </p>
                    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
                      Click the button below to choose a new password. This link expires in 1 hour.
                    </p>
                    <a href="{reset_link}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;font-size:15px;">
                      Reset Password
                    </a>
                    <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
                      If the button does not work, paste this link into your browser:<br>
                      <a href="{reset_link}" style="color:#2563eb;word-break:break-all;">{reset_link}</a>
                    </p>
                    <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
                      If you did not request this, you can ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """
