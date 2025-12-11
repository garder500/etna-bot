import {
    CommandInteraction,
    ChatInputCommandBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionContextType,
    LabelBuilder
} from "discord.js";

import CommandsBase from "@/commands/base.command";
import type Bot from "@/bot";
import { loginEtna } from "@/utils/etna";

const commandData = new ChatInputCommandBuilder()
    .setName("login")
    .setDescription("Connecte ton compte ETNA au bot")
    .setContexts([InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel])
    .toJSON();

export class LoginCommand extends CommandsBase {
    constructor(client: Bot) {
        super(client, commandData);
    }

    async run(interaction: CommandInteraction) {
        // 1. Création des inputs
        const usernameInput = new TextInputBuilder()
            .setCustomId("etna_username")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(50)
            .setPlaceholder("Ton login (ex: dupont_j)")
            .setRequired(true);

        const passwordInput = new TextInputBuilder()
            .setCustomId("etna_password")
            .setStyle(TextInputStyle.Short) // Un mot de passe est court
            .setMaxLength(50)
            .setPlaceholder("Ton mot de passe")
            .setRequired(true);

        // 2. Création des rangées (ActionRow) - Obligatoire pour les modals
        const firstActionRow = new LabelBuilder().setLabel("Identifiant ETNA").setTextInputComponent(usernameInput);
        const secondActionRow = new LabelBuilder().setLabel("Mot de passe ETNA").setTextInputComponent(passwordInput);

        const modal = new ModalBuilder()
            .setTitle("Connexion ETNA")
            .setCustomId("etna_login_modal")
            .addLabelComponents(firstActionRow, secondActionRow);

        // 3. Affichage de la modale
        await interaction.showModal(modal);

        // 4. Attente de la soumission
        try {
            const submittedInteraction = await interaction.awaitModalSubmit({
                time: 60000,
                filter: (i) => i.customId === "etna_login_modal" && i.user.id === interaction.user.id
            });

            // Une fois reçu, on diffère la réponse car loginEtna peut prendre du temps
            // Cela évite l'erreur "Unknown Interaction" si le traitement est > 3 secondes
            await submittedInteraction.deferReply({ flags: MessageFlags.Ephemeral });

            const username = submittedInteraction.components.getTextInputValue("etna_username");
            const password = submittedInteraction.components.getTextInputValue("etna_password");

            try {
                // On tente le login
                await loginEtna(username, password);

                // Si le login réussit, on sauvegarde en DB
                await this.client.database?.user.upsert({
                    where: { id: interaction.user.id },
                    create: {
                        id: interaction.user.id,
                        login: this.client.encryptString(username),
                        password: this.client.encryptString(password)
                    },
                    update: {
                        login: this.client.encryptString(username),
                        password: this.client.encryptString(password)
                    },
                });

                // On édite la réponse différée
                await submittedInteraction.editReply({
                    content: `✅ Connexion réussie en tant que **${username}** !`
                });

            } catch (error) {
                this.client.logger.error({
                    error,
                    message: "Error during login or database operation",
                });
                // Si loginEtna ou la DB échoue
                await submittedInteraction.editReply({
                    content: "❌ Identifiants invalides ou erreur de base de données."
                });
            }

        } catch (error) {
            // Ce catch attrape l'erreur de timeout du awaitModalSubmit (60s écoulées)
            // On ne peut répondre QUE si l'interaction n'a pas déjà reçu de réponse
            if (!interaction.replied && !interaction.deferred) {
                await interaction.followUp({
                    content: "⏱️ Temps écoulé, veuillez recommencer la commande.",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
}