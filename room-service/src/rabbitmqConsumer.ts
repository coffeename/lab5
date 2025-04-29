import amqp from 'amqplib';
import { AppDataSource } from './ormconfig';
import { AvailableSlot } from './rooms/slot.entity';

export async function startSlotAvailabilityConsumer() {
  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
  const connection = await amqp.connect(rabbitUrl);
  const channel = await connection.createChannel();
  const requestQueue = 'slot_availability_request';

  await channel.assertQueue(requestQueue, { durable: false });

  channel.consume(
    requestQueue,
    async (msg) => {
      if (!msg) return;
      const { room_id, start_time, end_time } = JSON.parse(msg.content.toString());

      const slotRepo = AppDataSource.getRepository(AvailableSlot);
      const slot = await slotRepo.findOne({
        where: {
          room: { id: room_id },
          start_time: new Date(start_time),
          end_time: new Date(end_time),
          is_available: true,
        },
      });

      const response = JSON.stringify({ available: !!slot });
      channel.sendToQueue(
        msg.properties.replyTo!,
        Buffer.from(response),
        { correlationId: msg.properties.correlationId! }
      );
      channel.ack(msg);
    },
    { noAck: false }
  );

  console.log('Room Service is listening for slot availability requests');
}
