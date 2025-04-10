import amqp from 'amqplib';
import { AppDataSource } from './ormconfig';
import { AvailableSlot } from './rooms/slot.entity';

export async function startSlotAvailabilityConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const requestQueue = 'slot_availability_request';

  await channel.assertQueue(requestQueue, { durable: false });

  channel.consume(requestQueue, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      const { room_id, start_time, end_time } = data;

      const slotRepository = AppDataSource.getRepository(AvailableSlot);
      const slot = await slotRepository.findOne({
        where: {
          room: { id: room_id },
          start_time: new Date(start_time),
          end_time: new Date(end_time),
          is_available: true
        }
      });

      let available = false;
      if (slot) {
        slot.is_available = false;
        await slotRepository.save(slot);
        available = true;
      } 

      const response = JSON.stringify({ available });
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
        correlationId: msg.properties.correlationId
      });
      channel.ack(msg);
    }
  });

  console.log('Room Service is listening for slot availability requests');
}
