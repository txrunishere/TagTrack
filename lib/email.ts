import { Resend } from "resend";

type SendPriceDropAlertProps = {
  userEmail: string;
  product: any;
  newPrice: number;
  oldPrice: number;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceDropAlert({
  newPrice,
  oldPrice,
  product,
  userEmail,
}: SendPriceDropAlertProps): Promise<
  { success: false; error: string } | { success: true; data: any }
> {
  try {
    const priceDrop = oldPrice - newPrice;
    const priceDropPercentage = ((priceDrop / oldPrice) * 100).toFixed(1);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_EMAIL!,
      to: userEmail,
      subject: `🎉 Price Drop Alert: ${product.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                'Helvetica Neue', Arial, sans-serif;
              color: #1f2937;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #e5e7eb;
              "
            >
              <!-- Header -->
              <div
                style="
                  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                  padding: 32px;
                  text-align: center;
                "
              >
                <h1 style="color: #ffffff; margin: 0; font-size: 28px">
                  Price Drop Alert!
                </h1>
                <p style="color: #dbeafe; margin-top: 8px; font-size: 14px">
                  A product you're tracking just got cheaper
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 28px">
                ${
                  product.image_url
                    ? `
                  <div style="text-align: center; margin-bottom: 20px;">
                    <img 
                      src="${product.image_url}" 
                      alt="${product.name}" 
                      style="max-width: 180px; border-radius: 10px; border: 1px solid #e5e7eb;" 
                    />
                  </div>
                `
                    : ""
                }

                <h2 style="margin-top: 0; font-size: 22px; color: #111827;">
                  ${product.name}
                </h2>

                <!-- Alert box -->
                <div
                  style="
                    background: #eff6ff;
                    border-left: 4px solid #3b82f6;
                    padding: 14px;
                    border-radius: 6px;
                    margin: 20px 0;
                  "
                >
                  <p style="margin: 0; color: #1d4ed8; font-size: 14px;">
                    <strong>Price dropped by ${priceDropPercentage}% 🎉</strong>
                  </p>
                </div>

                <!-- Price Table -->
                <div style="margin: 24px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td
                        style="
                          padding: 14px;
                          background: #f9fafb;
                          border-radius: 6px;
                          text-align: center;
                        "
                      >
                        <div style="font-size: 13px; color: #6b7280;">
                          Previous Price
                        </div>
                        <div
                          style="
                            font-size: 18px;
                            color: #9ca3af;
                            text-decoration: line-through;
                            margin-top: 4px;
                          "
                        >
                          ${product.currency} ${oldPrice.toFixed(2)}
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 16px; text-align: center;">
                        <div style="font-size: 13px; color: #6b7280;">
                          Current Price
                        </div>
                        <div
                          style="
                            font-size: 32px;
                            font-weight: bold;
                            color: #2563eb;
                            margin-top: 6px;
                          "
                        >
                          ${product.currency} ${newPrice.toFixed(2)}
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding: 14px;
                          background: #ecfdf5;
                          border-radius: 6px;
                          text-align: center;
                        "
                      >
                        <div style="font-size: 13px; color: #065f46;">
                          You Save
                        </div>
                        <div
                          style="
                            font-size: 22px;
                            font-weight: bold;
                            color: #059669;
                            margin-top: 4px;
                          "
                        >
                          ${product.currency} ${priceDrop.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- CTA -->
                <div style="text-align: center; margin: 30px 0;">
                  <a
                    href="${product.url}"
                    style="
                      display: inline-block;
                      background: #2563eb;
                      color: #ffffff;
                      padding: 14px 28px;
                      border-radius: 8px;
                      text-decoration: none;
                      font-weight: 600;
                      font-size: 15px;
                    "
                  >
                    View Product →
                  </a>
                </div>

                <!-- Footer -->
                <div
                  style="
                    border-top: 1px solid #e5e7eb;
                    padding-top: 20px;
                    margin-top: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #6b7280;
                  "
                >
                  <p style="margin: 0;">
                    You're receiving this email because you're tracking this product.
                  </p>

                  <p style="margin-top: 10px;">
                    <a
                      href="${process.env.NEXT_PUBLIC_APP_URL}"
                      style="color: #2563eb; text-decoration: none; font-weight: 500;"
                    >
                      View All Tracked Products
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>

      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log("Email error:", error);

    return {
      success: false,
      error: "Unable to send mail!",
    };
  }
}
