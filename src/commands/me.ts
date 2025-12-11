import { CommandInteraction, InteractionContextType, MessageFlags } from "discord.js";
import CommandBase from "./base.command";
import Intra from "@/utils/intra";
import type Bot from "@/bot";
import { delay } from "@/utils/global";

export class MeCommand extends CommandBase {
    constructor(client: Bot) {
        super(client, {
            name: "me",
            description: "Affiche les informations de votre compte ETNA",
            contexts: [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel]
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
        const userId = interaction.user.id;
        const intra = new Intra(userId, this.client.database, this.client);
        // we might need to wait a bit
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await delay(1000); // Wait 1 seconde
        const identity = await intra.getIdentity();
        if (!identity) {
            await interaction.editReply({ content: "Impossible de récupérer vos informations ETNA." });
            return;
        }
        await interaction.editReply({
            content: `👤 **${identity.firstname} ${identity.lastname}**\nLogin: ${identity.login}\nPromo: ${identity.promo}\nEmail: ${identity.email}`,
        });
    }
}
