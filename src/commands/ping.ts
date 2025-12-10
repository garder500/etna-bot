import {
    CommandInteraction,
    ChatInputCommandBuilder,
    EmbedBuilder,
    MessageFlags,
} from "discord.js";

import CommandsBase from "@/commands/base.command";
import type Bot from "@/bot";


const commandData = new ChatInputCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .toJSON();
export class PingCommand extends CommandsBase {
    constructor(client: Bot) {
        super(client, commandData);
    }

    async run(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("Pong!")
            .setDescription(`Latency: ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency: ${Math.round(this.client.ping ?? 0)}ms`)
            .setColor(0x00ff00);
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
}