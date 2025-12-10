import type {
    ApplicationCommand,
    AutocompleteInteraction,
    CommandInteraction,
    Interaction,
    RESTPostAPIApplicationCommandsJSONBody,
    APIApplicationCommand,
    CacheType
} from "discord.js";
import Bot from "@/bot";

type Commande = RESTPostAPIApplicationCommandsJSONBody;
export default abstract class baseCommands {
    name: string;
    client: Bot;
    command: Interaction<CacheType> | ApplicationCommand | APIApplicationCommand | undefined;
    autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
    constructor(client: Bot, data: Commande, guildId?: string) {
        if (!guildId) {
            client.application?.commands
                .create(data)
                .then((cmd) => {
                    this.client?.logger?.info(`[command] ${data.name} created`);
                    this.command = cmd;
                })
                .catch((err) => {
                    this.client?.logger?.error(`[command] ${data.name} not created`);
                    this.client?.logger?.error(err);
                });
        }

        this.name = data.name;
        this.client = client;
    }

    abstract run(interaction: CommandInteraction<CacheType>): Promise<void>;
}