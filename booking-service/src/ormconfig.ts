import "reflect-metadata";
import { DataSource } from "typeorm";
import { Booking }     from "./bookings/booking.entity";
import { AvailableSlot } from "./rooms/slot.entity";
import { Room }         from "./rooms/room.entity";

export const AppDataSource = new DataSource({
  type:       "postgres",
  host:       process.env.DB_HOST || "postgres",
  port:       Number(process.env.DB_PORT) || 5432,
  username:   process.env.DB_USER || "postgres",
  password:   process.env.DB_PASSWORD || "postgres",
  database:   process.env.DB_NAME || "mydb",
  synchronize:  false,        // ← вимикаємо
  migrationsRun: false,       // ← убезпечуємося ще раз
  logging:      false,
  entities:   [Booking, AvailableSlot, Room],
});