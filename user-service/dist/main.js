"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
async function bootstrap() {
    const server = (0, express_1.default)();
    server.get('/health', (_req, res) => res.sendStatus(200));
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    await app.init();
    const port = +(process.env.PORT || 3000);
    server.listen(port, () => {
        console.log(`User Service (Nest) running on port ${port}`);
    });
}
bootstrap();
