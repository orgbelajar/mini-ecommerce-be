import { getJetStreamClient } from "../../../applications/nats";
import { prisma } from "../../../applications/database";
import { logger } from "../../../applications/logging";
import { Resend } from "resend";
import { StringCodec } from "nats";
import type {
  ExportOrderMessage,
  CartExportData,
} from "../../../model/export-model";

const sc = StringCodec();
const resend = new Resend(process.env.RESEND_API_KEY);

export class ExportConsumer {
  static async start(): Promise<void> {
    const js = getJetStreamClient();

    const consumer = await js.consumers.get("EXPORT", "export-order-worker");

    // Jika consumer belum ada, buat dulu
    // Ini di-handle di init()

    logger.info("Export order consumer mulai mendengarkan pesan...");

    const messages = await consumer.consume();

    for await (const msg of messages) {
      try {
        const data: ExportOrderMessage = JSON.parse(sc.decode(msg.data));

        logger.info(`Memproses export order untuk cart: ${data.cartId}`);

        // 1. Ambil data cart beserta produknya
        const cartData = await this.getCartData(data.cartId);

        // 2. Generate HTML email
        const htmlContent = this.generateEmailHtml(cartData);

        // 3. Kirim email via Resend
        await this.sendEmail(data.targetEmail, cartData.cartName, htmlContent);

        logger.info(`Email laporan berhasil dikirim ke ${data.targetEmail}`);

        // 4. Acknowledge pesan (tandai sudah diproses)
        msg.ack();
      } catch (error) {
        logger.error(
          `Gagal memproses export order: ${(error as Error).message}`,
        );

        // Negative acknowledge → NATS akan kirim ulang (maks 3x sesuai config)
        msg.nak();
      }
    }
  }

  static async getCartData(cartId: string): Promise<CartExportData> {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        owner: {
          select: { username: true },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new Error(`Cart dengan id ${cartId} tidak ditemukan`);
    }

    const products = cart.items.map((item) => ({
      productName: item.product.name,
      price: item.product.price,
      qty: item.qty,
      subtotal: item.product.price * item.qty,
    }));

    const totalPrice = products.reduce((sum, p) => sum + p.subtotal, 0);
    const totalItems = products.reduce((sum, p) => sum + p.qty, 0);

    return {
      cartName: cart.name,
      ownerUsername: cart.owner.username,
      products,
      totalItems,
      totalPrice,
      exportedAt: new Date().toISOString(),
    };
  }

  static generateEmailHtml(data: CartExportData): string {
    const productRows = data.products
      .map(
        (p) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${p.productName}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Rp ${p.price.toLocaleString("id-ID")}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${p.qty}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Rp ${p.subtotal.toLocaleString("id-ID")}</td>
        </tr>`,
      )
      .join("");

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Laporan Keranjang Belanja</h2>
        <p><strong>Keranjang:</strong> ${data.cartName}</p>
        <p><strong>Pemilik:</strong> ${data.ownerUsername}</p>
        <p><strong>Tanggal Export:</strong> ${new Date(data.exportedAt).toLocaleString("id-ID")}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Produk</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Harga</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
          <tfoot>
            <tr style="background-color: #f5f5f5; font-weight: bold;">
              <td style="padding: 8px; border: 1px solid #ddd;">Total</td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${data.totalItems}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Rp ${data.totalPrice.toLocaleString("id-ID")}</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="color: #666; font-size: 12px;">Email ini dikirim secara otomatis dari sistem E-Commerce App.</p>
      </div>
    `;
  }

  static async sendEmail(
    targetEmail: string,
    cartName: string,
    htmlContent: string,
  ): Promise<void> {
    const { error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL || "E-Commerce <onboarding@resend.dev>",
      to: [targetEmail],
      subject: `Laporan Keranjang Belanja: ${cartName}`,
      html: htmlContent,
    });

    if (error) {
      throw new Error(`Gagal mengirim email: ${error.message}`);
    }
  }
}
