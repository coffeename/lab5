import amqp, { Channel } from "amqplib";

let channel: Channel | null = null;

export async function getRabbitChannel(): Promise<Channel> {
  if (channel) return channel;
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
  return channel;
}
