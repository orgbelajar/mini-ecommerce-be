import app from "./server/index";
import { connectNats } from "./applications/nats";
import { ExportConsumer } from "./services/exports/consumer/index";
import { logger } from "./applications/logging";

const host = process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";
const port = Number(process.env.PORT) || 3000;

// Inisialisasi NATS JetStream dan consumer
async function initNats() {
  try {
    await connectNats();

    // Buat consumer durable jika belum ada
    const { connect } = await import("nats");
    const nc = await connect({
      servers: process.env.NATS_URL || "nats://localhost:4222",
    });
    const jsm = await nc.jetstreamManager();

    try {
      await jsm.consumers.add("EXPORT", {
        durable_name: "export-order-worker",
        filter_subject: "export.order",
        ack_policy: "explicit" as unknown as import("nats").AckPolicy,
        max_deliver: 3,
      });
    } catch {
      // Consumer sudah ada
    }

    await nc.drain();

    // Jalankan consumer di background
    ExportConsumer.start().catch((err) => {
      logger.error(`Export consumer error: ${err.message}`);
    });

    logger.info("NATS JetStream dan consumer berhasil diinisialisasi");
  } catch (error) {
    logger.error(`Gagal menginisialisasi NATS: ${(error as Error).message}`);
  }
}

initNats();

export default {
  hostname: host,
  port: port,
  fetch: app.fetch,
};
