import { getJetStreamClient } from "../../../applications/nats";
import { logger } from "../../../applications/logging";
import type { ExportOrderMessage } from "../../../model/export-model";
import { StringCodec } from "nats";

const sc = StringCodec();

export class ExportPublisher {
  static async publishExportOrder(message: ExportOrderMessage): Promise<void> {
    const js = getJetStreamClient();

    const data = sc.encode(JSON.stringify(message));

    await js.publish("export.order", data);

    logger.info(
      `Pesan export order untuk cart ${message.cartId} telah dipublikasikan ke NATS`,
    );
  }
}
